import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserRepository } from "../repositories/user.repository";
import { UserI, UserL } from "../models/user";
import { UserFilter } from "../filters/user.filter";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Path, PathParam, QueryParam, GET, POST, DELETE, PUT } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { LoginFilter } from "../filters/login.filter";
import { JWTAuth } from "../filters/jwtAuth";

@Path("/api/users")
@Tags("Users")
@Controller({ route: "/api/users" })
export class UserController extends ApiController {
    constructor(private userRepo: UserRepository) {
        super();
    }

    /**
     * Produce an user with a given email
     * @example
     * url/q?email="test@email.com"
     * @returns
     * User {
     *        id: number;
     *        name: string;
     *        lastName: string;
     *        email: string;
     *        password?: string;
     *        idDocumentType: string;
     *        idDocumentNumber: number;
     *        rol: string;
     *        status: number;
     *      }
     */
    @GET
    @Path("/q")
    @Response<UserI>(200, "Retrieve an User.")
    @Response(404, "User not found.")
    @Action({ route: "/q", query: ":email", method: HttpMethod.GET })
    async getByEmail(@QueryParam("email") email: string) {
        try {
            //const { email } = this.httpContext.request.query;
            const user = await this.userRepo.find(["email"], [email]);
            return this.httpContext.response.status(200).json({
                message: "User found",
                data: user,
                error: false,
            });
        } catch (error) {
            return this.httpContext.response.status(404).json({
                message: "User not found",
                data: null,
                error: true,
            });
        }
    }
    /**
     * UPDATES an user
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
    @Response<UserI>(200, "Updates an User.")
    @Response(404, "User not found.")
    @Action({ route: "/update", filters: [UserFilter, JWTAuth], fromBody: true, method: HttpMethod.PUT })
    async update({ entity, decodedToken }: { entity: UserI; decodedToken: UserI }) {
        try {
            if (entity.id !== decodedToken.id) throw new Error("Unauthorized");
            entity.password = await bcrypt.hash(entity.password, 10);
            const newUser = {
                ...decodedToken,
                name: entity.name,
                lastName: entity.lastName,
                email: entity.email,
                password: entity.password,
            };
            const result = await this.userRepo.update(newUser);
            return this.httpContext.response.status(201).json({
                message: "User updated",
                data: result,
                error: false,
            });
        } catch (error) {
            if (error.message === "Unauthorized") {
                return this.httpContext.response.status(401).json({
                    message: error.message,
                    data: null,
                    error: true,
                });
            }
            return this.httpContext.response.status(404).json({
                message: "User " + error.message,
                data: null,
                error: true,
            });
        }
    }

    /**
     * CREATES an user
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
    @Response<UserI>(200, "Creates an User.")
    @Response(500, "Duplicate Email.")
    @Response(500, "Duplicate idDocumentNumber.")
    @Response(500, "Server Error.")
    @Action({ route: "/signup", filters: [UserFilter], fromBody: true, method: HttpMethod.POST })
    async post(user: UserI) {
        try {
            user.password = await bcrypt.hash(user.password, 10);
            const { insertId } = await this.userRepo.insertOne(user);
            const userCreated = { id: insertId, ...user };
            const token = jwt.sign(userCreated, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "30d" });
            this.httpContext.response.cookie("token", token, { httpOnly: true });
            return this.httpContext.response.status(201).json({
                message: "User created",
                data: userCreated,
                error: false,
            });
        } catch (error) {
            let message = "Failed to create user";
            if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("email")) {
                message = "Email already exists";
            } else if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("idDocumentNumber")) {
                message = "ID document number already exists";
            }
            return this.httpContext.response.status(500).json({
                message: message,
                data: null,
                error: true,
            });
        }
    }

    /**
     * Logins an user with a given email and password
     * @param user - {email: string, password: string}
     * @returns
     */
    @POST
    @Path("/login")
    @Response<UserI>(200, "Logins an user.")
    @Response(401, "Incorrect username or password.")
    @Response(401, "User not found.")
    @Action({ route: "/login", fromBody: true, method: HttpMethod.POST, filters: [LoginFilter] })
    async login(user: UserL) {
        try {
            const [userdb] = await this.userRepo.find(["email"], [user.email]);
            if (!userdb) {
                return this.httpContext.response.status(401).json({
                    message: "Incorrect username or password",
                    data: undefined,
                    error: true,
                });
            }
            const isPasswordValid = await bcrypt.compare(user.password, userdb.password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                return this.httpContext.response.status(401).json({
                    message: "Incorrect username or password",
                    data: undefined,
                    error: true,
                });
            }
            delete userdb.password;
            const { ...userobj } = userdb;
            const token = jwt.sign(userobj, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "30d" });
            this.httpContext.response.cookie("token", token, { httpOnly: true });
            return this.httpContext.response.status(200).json({
                message: "Login successful",
                data: userdb,
                error: false,
            });
        } catch (error) {
            console.log(error.message);
            return this.httpContext.response.status(404).json({
                message: "User not found",
                data: null,
                error: true,
            });
        }
    }
    /**
     * DELETE an user
     * @param id
     * @returns
     */
    @DELETE
    @Path("/")
    @Response<UserI>(200, "User deleted.")
    @Response(404, "User not found.")
    @Action({ route: "/", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuth] })
    async delete({ entity, decodedToken }: { entity: UserI; decodedToken: UserI }) {
        try {
            if (entity.id !== decodedToken.id && decodedToken.rol !== "Admin") throw new Error("Unauthorized");
            const userdb = await this.userRepo.getById(Number(entity.id));
            if (decodedToken.rol !== "Admin" && !(await bcrypt.compare(entity.password, userdb.password))) throw new Error("Unauthorized");
            userdb.status = 0;
            const userDeleted = await this.userRepo.update(userdb);
            return this.httpContext.response.status(200).json({
                message: "User deleted",
                data: userDeleted,
                error: false,
            });
        } catch (error) {
            if (error.message === "Unauthorized" || error.message === "data and hash arguments required") {
                return this.httpContext.response.status(401).json({
                    message: "Unauthorized",
                    data: null,
                    error: true,
                });
            }
            if (error.message === "Unable to retrieve the entity.") {
                return this.httpContext.response.status(404).json({
                    message: "User not found",
                    data: null,
                    error: true,
                });
            }
            return this.httpContext.response.status(500).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }

    /**
     * GET an user with a given id
     * @param id
     * @returns
     */
    @GET
    @Path("/:id")
    @Response<UserI>(200, "Retrieve an User.")
    @Response(404, "User not found.")
    @Action({ route: "/:id", method: HttpMethod.GET })
    async getById(@PathParam("id") id: number) {
        try {
            const user = await this.userRepo.getById(Number(id));
            return this.httpContext.response.status(200).json({
                message: "User found",
                data: user,
                error: false,
            });
        } catch (error) {
            return this.httpContext.response.status(404).json({
                message: "User not found",
                data: null,
                error: true,
            });
        }
    }

    /**
     * Produce a list of all users
     * @returns a list of all users
     */
    @POST
    @Path("/")
    @Response<UserI[]>(200, "Retrieve a list of all Users.")
    @Response(404, "Users not found.")
    @Action({ route: "/", method: HttpMethod.POST, filters: [JWTAuth], fromBody: true })
    async getAll({ decodedToken }: { decodedToken: UserI }) {
        try {
            const { id } = decodedToken;
            const user = await this.userRepo.getById(id);
            if (user.rol !== "Admin") throw new Error("Unauthorized");
            const users = await this.userRepo.getBy(["name", "lastName", "email", "idDocumentType", "idDocumentNumber", "rol", "status"]);
            return this.httpContext.response.status(200).json({
                message: "Users found",
                data: users,
                error: false,
            });
        } catch (error) {
            console.log(error.message);
            if (error.message === "Unauthorized") {
                return this.httpContext.response.status(401).json({
                    message: error.message,
                    data: null,
                    error: true,
                });
            }
            return this.httpContext.response.status(404).json({
                message: "Users not found",
                data: null,
                error: true,
            });
        }
    }
}
