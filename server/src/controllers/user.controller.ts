import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserRepository } from "../repositories/user.repository";
import { UserInterface, UserLoginInterface } from "../models/user";
import { UserFilter, LoginFilter } from "../filters/user.filter";
import bcrypt from "bcrypt";
import { Path, PathParam, GET, POST, DELETE, PUT, Security } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { JWTAuthFilter, isAdminFilter } from "../filters/jwtAuth";
import { StoreRepository } from "../repositories/store.repository";

@Path("/api/users")
@Tags("Users")
@Controller({ route: "/api/users" })
export class UserController extends ApiController {
    constructor(private readonly userRepo: UserRepository, private readonly storeRepo: StoreRepository) {
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
    async update(user: UserInterface) {
        const { email } = this.userRepo.getAuth();
        if (user.email !== email) throw new Error("Unauthorized");
        user.password = await bcrypt.hash(user.password, 10);
        await this.userRepo.update(user);
        const userUpdated = await this.userRepo.getById(user.email);
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
        const [userR] = await this.userRepo.checkStatus(user.email);
        if(userR && userR.status === 1) {
            throw new Error("User already exist");
        } else if (userR && userR.status === 0) {
            //const response = await this.userRepo.getById(user.email);
            const userUpdated = await this.userRepo.update({ status: 1, email: user.email });
            return userUpdated;
        } else if (!userR) {
            const { insertId } = await this.userRepo.insertOne(user);
            delete user.password;
            const userCreated = { id: insertId, ...user };
            return userCreated;
        }
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
    async disable(user: UserInterface) {
        const { email } = this.userRepo.getAuth();
        if (user.email !== email) throw new Error("Unauthorized");
        const [userdb] = await this.userRepo.find({ email: user.email, status: 1 });
        if (!userdb) throw new Error("User not found");
        try {
            await bcrypt.compare(user.password, userdb.password);
        } catch {
            throw new Error("Unauthorized");
        }
        userdb.status = 0;
        await this.userRepo.update(userdb);
        const userDisabled = await this.userRepo.getById(user.email);
        delete userDisabled.password;
        return userDisabled;
    }
    /**
     * GET an user with a given email
     * /q?email=example@email.com
     */
    @GET
    @Path("/:email")
    @Response<UserInterface>(200, "Retrieve an User.")
    @Response(404, "User not found.")
    @Action({ route: "/:email", method: HttpMethod.GET, filters: [JWTAuthFilter] })
    async getById(@PathParam("email") email: string) {
        const user = await this.userRepo.getById(String(email));
        if (!user) throw new Error("User not found");
        delete user.password;
        return user;
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
        const users = await this.userRepo.getAllUsers();
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
    async adminDisable(user: UserInterface) {
        const { email } = this.userRepo.getAuth();
        /* const admin = await this.userRepo.getById(email);
        try {
            await bcrypt.compare(user.password, admin.password);
        } catch {
            throw new Error("Unauthorized");
        } */
        const userToDisable = await this.userRepo.getById(user.email);
        if (!userToDisable) throw new Error("User not found");
        if (userToDisable.rol === "Admin" && user.email !== email) throw new Error("Unauthorized");
        await this.userRepo.update({ ...userToDisable, status: 0 });
        const userDisabled = await this.userRepo.getById(user.email);
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
    async adminDelete(user: UserInterface) {
        const { email } = this.userRepo.getAuth();
        /* const admin = await this.userRepo.getById(email);
        try {
            await bcrypt.compare(user.password, admin.password);
        } catch {
            throw new Error("Unauthorized");
        } */
        const userToDelete = await this.userRepo.getById(user.email);
        if (userToDelete.rol === "Admin" && user.email !== email) throw new Error("Unauthorized");
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
    async restore(user: UserInterface) {
        const { email } = this.userRepo.getAuth();
        if (user.email === email) throw new Error("Unauthorized");
        const userToRestore = await this.userRepo.getById(user.email);
        if (!userToRestore) throw new Error("User not found");
        if (userToRestore.rol === "Admin" && user.email !== email) throw new Error("Unauthorized");
        await this.userRepo.update({ ...userToRestore, status: 1 });
        const userRestored = await this.userRepo.getById(user.email);
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
    @Path("/admin/change_role_manager")
    @Tags("admin")
    @Response<UserInterface>(200, "Change client to manager.")
    @Response(401, "Unauthorized")
    @Response(404, "User not found.")
    @Action({ route: "/admin/change_role_manager", method: HttpMethod.PUT, fromBody: true, filters: [JWTAuthFilter, isAdminFilter] })
    async changeRoleManager(user: { email: string; idStore: number }) {
        const userToChange = await this.userRepo.getById(user.email);
        if (userToChange.rol === "Admin") throw new Error("Unauthorized");
        if (!userToChange) throw new Error("User not found");

        await this.userRepo.update({ ...userToChange, rol: "Manager" });
        await this.storeRepo.update({ managerId: userToChange.id, id: user.idStore });

        delete userToChange.password;
        return { ...userToChange, rol: "Manager" };
    }

    /**
     * Change role of user
     * entity: UserInterface - The user to restore
     * decodedToken: UserInterface - It's the token each user get when they login or signup
     * @param id
     * @returns
     */
    @PUT
    @Path("/admin/change_role_client")
    @Tags("admin")
    @Response<UserInterface>(200, "Change client to manager.")
    @Response(401, "Unauthorized")
    @Response(404, "User not found.")
    @Action({ route: "/admin/change_role_client", method: HttpMethod.PUT, fromBody: true, filters: [JWTAuthFilter, isAdminFilter] })
    async changeRoleClient(user: { email: string }) {
        const userToChange = await this.userRepo.getById(user.email);
        if (userToChange.rol === "Admin") throw new Error("Unauthorized");
        if (!userToChange) throw new Error("User not found");

        await this.userRepo.update({ ...userToChange, rol: "Client" });
        const stores = await this.storeRepo.find({ managerId: userToChange.id });
        for (const store of stores) {
            await this.storeRepo.update({ managerId: null, id: store.id });
        }

        userToChange.rol = "CLient";
        delete userToChange.password;
        return { ...userToChange, rol: "Client" };
    }
}
