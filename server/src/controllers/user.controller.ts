import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserRepository } from "../repositories/user.repository";
import { UserInterface, UserLoginInterface, AdminInterface } from "../models/user";
import { UserFilter, LoginFilter } from "../filters/user.filter";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Path, PathParam, GET, POST, DELETE, PUT, Security } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { JWTAuthFilter, isAdminFilter } from "../filters/jwtAuth";
import { StoreRepository } from "../repositories/store.repository";

@Path("/api/users")
@Tags("Users")
@Controller({ route: "/api/users" })
export class UserController extends ApiController {
    constructor(private userRepo: UserRepository, private storeRepo: StoreRepository) {
        super();
    }

    /**
     * UPDATES an user
     * entity: UserInterface - The user to delete
     * decodedToken: UserInterface - It's the token each user get when they login or signup
     * @param user
     * @returns
     *
     * @example
     * User {
     *          id: 1;
     *          name: "John";
     *          lastName: "Doe";
     *          email: "john@email.com";
     *          password: "123johnDoe";
     *          idDocumentType: "DNI";
     *          idDocumentNumber: 12345678;
     *          rol: "client";
     *          status: true;
     *      }
     */
    @PUT
    @Path("/update")
    @Response<UserInterface>(200, "Updates an User.")
    @Response(404, "User not found.")
    @Action({ route: "/update", filters: [JWTAuthFilter, UserFilter], fromBody: true, method: HttpMethod.PUT })
    async update({ entity, decodedToken }: { entity: UserInterface; decodedToken: UserInterface }) {
        if (entity.email !== decodedToken.email) throw new Error("Unauthorized");
        entity.password = await bcrypt.hash(entity.password, 10);
        await this.userRepo.update(entity);
        const userUpdated = await this.userRepo.getById(entity.email);
        delete userUpdated.password;
        return userUpdated;
    }

    /**
     * CREATES an user
     * entity: UserInterface - The user to delete
     * decodedToken: UserInterface - It's the token each user get when they login or signup
     * @param user
     * @returns
     *
     * @example
     * User {
     *          id: 1;
     *          name: "John";
     *          lastName: "Doe";
     *          email: "john@email.com";
     *          password: "123johnDoe";
     *          idDocumentType: "DNI";
     *          idDocumentNumber: 12345678;
     *          rol: "client";
     *          status: true;
     *      }
     */
    @POST
    @Path("/signup")
    @Response<UserInterface>(200, "Creates an User.")
    @Response(500, "Duplicate Email.")
    @Response(500, "Duplicate idDocumentNumber.")
    @Response(500, "Server Error.")
    @Action({ route: "/signup", filters: [UserFilter], fromBody: true, method: HttpMethod.POST })
    async post(user: UserInterface) {
        user.password = await bcrypt.hash(user.password, 10);
        const { insertId } = await this.userRepo.insertOne(user);
        delete user.password;
        const userCreated = { id: insertId, ...user };
        const token = jwt.sign(userCreated, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "30d" });
        this.httpContext.response.setHeader("x-auth", token);
        return userCreated;
    }

    /**
     * Logins an user with a given email and password
     * @param user - {email: string, password: string}
     * @returns
     */
    @POST
    @Path("/login")
    @Response<UserInterface>(200, "Logins an user.")
    @Response(401, "Incorrect username or password.")
    @Response(401, "User not found.")
    @Action({ route: "/login", fromBody: true, method: HttpMethod.POST, filters: [LoginFilter] })
    async login(user: UserLoginInterface) {
        const [userdb] = await this.userRepo.find({ email: user.email });
        if (!userdb || userdb.status === 0) throw new Error("Incorrect username or password");
        const isPasswordValid = await bcrypt.compare(user.password, userdb.password);
        if (!isPasswordValid) throw new Error("Incorrect username or password");
        delete userdb.password;
        return userdb;
    }

    /**
     * DELETE an user
     * entity: UserInterface - The user to delete
     * decodedToken: UserInterface - It's the token each user get when they login or signup
     * @param id
     * @returns
     */
    @DELETE
    @Path("/disable")
    @Response<UserInterface>(200, "User disabled.")
    @Response(404, "User not found.")
    @Action({ route: "/disable", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuthFilter, UserFilter] })
    async disable({ entity, decodedToken }: { entity: UserInterface; decodedToken: UserInterface }) {
        if (entity.email !== decodedToken.email) throw new Error("Unauthorized");
        const [userdb] = await this.userRepo.find({ email: entity.email, status: 1 });
        if (!userdb) throw new Error("User not found");
        try {
            await bcrypt.compare(entity.password, userdb.password);
        } catch {
            throw new Error("Unauthorized");
        }
        userdb.status = 0;
        await this.userRepo.update(userdb);
        const userDisabled = await this.userRepo.getById(entity.email);
        delete userDisabled.password;
        return userDisabled;
    }
    /**
     * GET an user with a given id
     * @param id
     * @returns
     */
    @GET
    @Path("/:id")
    @Response<UserInterface>(200, "Retrieve an User.")
    @Response(404, "User not found.")
    @Action({ route: "/:id", method: HttpMethod.GET })
    async getById(@PathParam("id") id: number) {
        const user = await this.userRepo.find({ id: id });
        delete user[0].password;
        return user[0];
    }

    /******************
    ADMIN ONLY ROUTES
    ******************/
    /**
     * Produce a list of all users
     * decodedToken: UserInterface - It's the token each user get when they login or signup
     * @returns a list of all users
     */
    @GET
    @Path("/")
    @Tags("admin")
    @Security("Admin")
    @Response<UserInterface[]>(200, "Retrieve a list of all Users.")
    @Response(401, "Unauthorized")
    @Response(404, "Users not found.")
    @Action({ route: "/", method: HttpMethod.GET, filters: [JWTAuthFilter, isAdminFilter] })
    async getAll() {
        const users = await this.userRepo.getBy(["name", "lastName", "email", "idDocumentType", "idDocumentNumber", "rol", "status"]);
        return users;
    }

    /**
     * DISABLE an user
     * @param - { email: userEmail, password: adminPassword }
     * @param token
     * @returns
     */
    @DELETE
    @Path("/admin/disable")
    @Tags("admin")
    @Response<UserInterface>(200, "User disabled.")
    @Response(404, "User not found.")
    @Action({ route: "/admin/disable", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuthFilter, isAdminFilter] })
    async adminDisable({ entity, decodedToken }: { entity: UserInterface; decodedToken: AdminInterface }) {
        const admin = await this.userRepo.getById(decodedToken.email);
        try {
            await bcrypt.compare(entity.password, admin.password);
        } catch {
            throw new Error("Unauthorized");
        }
        const userToDisable = await this.userRepo.getById(entity.email);
        if (!userToDisable) throw new Error("User not found");
        if (userToDisable.rol === "Admin" && entity.email !== decodedToken.email) throw new Error("Unauthorized");
        await this.userRepo.update({ ...userToDisable, status: 0 });
        const userDisabled = await this.userRepo.getById(entity.email);
        delete userDisabled.password;
        return userDisabled;
    }

    /**
     * DELETE any user
     * @param - { email: userEmail, password: adminPassword }
     * @param token
     * @returns
     */
    @DELETE
    @Path("/admin/delete")
    @Tags("admin")
    @Response<UserInterface>(200, "User deleted.")
    @Response(404, "User not found.")
    @Action({ route: "/admin/delete", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuthFilter, isAdminFilter] })
    async adminDelete({ entity, decodedToken }: { entity: UserInterface; decodedToken: AdminInterface }) {
        const admin = await this.userRepo.getById(decodedToken.email);
        try {
            await bcrypt.compare(entity.password, admin.password);
        } catch {
            throw new Error("Unauthorized");
        }
        const userToDelete = await this.userRepo.getById(entity.email);
        if (userToDelete.rol === "Admin" && entity.email !== decodedToken.email) throw new Error("Unauthorized");
        await this.userRepo.delete(userToDelete);
        return userToDelete;
    }

    /**
     * RESTORE an user
     * entity: UserInterface - The user to restore
     * decodedToken: UserInterface - It's the token each user get when they login or signup
     * @param id
     * @returns
     */
    @PUT
    @Path("/admin/restore")
    @Tags("admin")
    @Response<UserInterface>(200, "User restored.")
    @Response(401, "Unauthorized")
    @Response(404, "User not found.")
    @Action({ route: "/admin/restore", method: HttpMethod.PUT, fromBody: true, filters: [JWTAuthFilter, isAdminFilter] })
    async restore({ entity, decodedToken }: { entity: UserInterface; decodedToken: AdminInterface }) {
        if (entity.email === decodedToken.email) throw new Error("Unauthorized");
        const userToRestore = await this.userRepo.getById(entity.email);
        if (!userToRestore) throw new Error("User not found");
        if (userToRestore.rol === "Admin" && entity.email !== decodedToken.email) throw new Error("Unauthorized");
        await this.userRepo.update({ ...userToRestore, status: 1 });
        const userRestored = await this.userRepo.getById(entity.email);
        delete userRestored.password;
        return userRestored;
    }

    /**
     * Change role of user
     * entity: UserInterface - The user to restore
     * decodedToken: UserInterface - It's the token each user get when they login or signup
     * @param id
     * @returns
     */
    @PUT
    @Path("/admin/change_role")
    @Tags("admin")
    @Response<UserInterface>(200, "Change client to manager.")
    @Response(401, "Unauthorized")
    @Response(404, "User not found.")
    @Action({ route: "/admin/change_role", method: HttpMethod.PUT, fromBody: true, filters: [JWTAuthFilter, isAdminFilter] })
    async raiseToManager({ entity }: { entity: { email: string; idStore: number } }) {
        const userRaiseToManager = await this.userRepo.getById(entity.email);
        if (userRaiseToManager.rol === "Admin") throw new Error("Unauthorized");
        if (!userRaiseToManager) throw new Error("User not found");
        await this.userRepo.update({ ...userRaiseToManager, rol: "Manager" });
        const manager = await this.userRepo.getById(entity.email);
        await this.storeRepo.update({ managerId: manager.id, id: entity.idStore });

        delete manager.password;
        return manager;
    }
}
