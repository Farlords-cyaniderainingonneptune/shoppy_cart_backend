import db from "../../config/db/index.js";
import queries from "../queries/queries.auth.js";

export const checkUserExistsByEmail = async (email) => {
    const user = await db.oneOrNone(queries.checkIfUserExistsByEmail, [ email.trim().toLowerCase() ]);
    return user;
};
export const createAdmin = async (email, display_name, google_hash, verificationCode, verificationCodeExpireAt) => {
    const user = await db.oneOrNone(queries.createUser, [
        email.trim().toLowerCase(),
        display_name.trim().toLowerCase(),
        google_hash,
        verificationCode,
        verificationCodeExpireAt
    ]);
    return user;
};
export const createUser = async (email, hash, verificationCode, verificationCodeExpireAt) => {
    const user = await db.oneOrNone(queries.createUser, [
        email.trim().toLowerCase(),
        hash,
        verificationCode,
        verificationCodeExpireAt
    ]);
    return user;
};
export const checkIfUserActivelyExistsByEmail = async (email) => {
    const user = await db.oneOrNone(queries.checkIfUserActivelyExistsByEmail, [ email.trim().toLowerCase() ]);
    return user;
};
export const updateUserVerification = async (email) => {
    const verifiedUser = await db.oneOrNone(queries.updateUserAccountVerification, [ email.trim().toLowerCase() ]);
    return verifiedUser; 
};
export const updateUserVerificationCode = async (email, verificationCode, verificationCodeExpireAt) => {
    const updatedUser = await db.oneOrNone(queries.updateUserVerificationCode, [ email.trim().toLowerCase(), verificationCode, verificationCodeExpireAt ]);
    return updatedUser;
};
export const checkIfUserActivelyExistsByEmailAndUsername = async (email)=>{
    const user = await db.oneOrNone(queries.checkIfUserActivelyExistsByEmailAndUsername, [email.trim().toLowerCase()]);
    return user;
};
export const userPassword = async (user_id) => {
    const userPasswordDetails = await db.oneOrNone(queries.userPassword, [ user_id ]);
    return userPasswordDetails;
};
export const updateUserOnLogin = async (user_id) => {
    const user = await db.oneOrNone(queries.updateUserOnLogin, [ user_id ]);
    return user;
};
export const checkIfUserActivelyExistsByUserId = async (user_id) => {
    const user = await db.oneOrNone(queries.checkIfUserActivelyExistsByUserId, [ user_id ]);
    return user;
};
export const checkIfUserExistsByUserId = async (user_id) => {
    const user = await db.oneOrNone(queries.checkIfUserExistsByUserId, [ user_id ]);
    return user;
};
export const updateUserPassword = async(email, hash)=>{
    const user = await db.oneOrNone(queries.updateUserPassword,[email, hash]);
    return user;
};

export const checkIfActualAdmin = async (user_id)=>{
    const actualAdmin = await db.oneOrNone(queries.checkIfActualAdmin,[user_id, 'admin', 'active']);
    return actualAdmin;
};

export const checkIfWasAdmin = async (user_id, role)=>{
    const actualAdmin = await db.oneOrNone(queries.checkIfWasAdmin,[user_id, 'admin']);
    return actualAdmin;
};

export const checkIfSuperAdmin = async (user_id, current_roles, status)=>{
    const superAdmin = await db.oneOrNone(queries.checkIfActualAdmin,[user_id, 'super admin', 'active']);
    return superAdmin;
};

export const updateAdminOnLogin = async (user_id) => {
    const admin = await db.oneOrNone(queries.updateAdminOnLogin, [ user_id ]);
    return admin;
};
export const updateSuperAdminOnLogin = async (user_id) => {
    const superAdmin = await db.oneOrNone(queries.updateSuperAdminOnLogin, [ user_id ]);
    return superAdmin;
};
export const checkIfUserActive = async (user_id) => {
    const user = await db.oneOrNone(queries.checkIfUserActive, [ user_id ]);
    return user;
};
export const isLoggedIn = async (user_id) => {
    const user = await db.oneOrNone(queries.isLoggedIn, [ user_id ]);
    return user;
};
export const updateUserOnLogout = async (user_id) => {
    const user = await db.oneOrNone(queries.updateUseronLogout, [ user_id ]);
    return user;
};
export const updateAdminOnLogout = async (user_id) => {
    const user = await db.oneOrNone(queries.updateAdminOnLogout, [ user_id ]);
    return user;
};

export const checkIfAdminOrSuperAdmin = async (user_id) => {
  const user = await db.oneOrNone(queries.checkIfAdminOrSuperAdmin, [user_id]);
  return user;
};

export const countUsers = async () => {
    const user = await db.oneOrNone(queries.countUser);
    return user;
};
export const editUserInfo = async (user_id, full_name) => {
    const user = await db.oneOrNone(queries.editUserInfo,[user_id, full_name.trim().toLowerCase()]);
    return user;
};
export const fetchRecentUsers =  async(limit) => {
    const user = await db.any(queries.fetchRecentUsers, [parseInt(10)]);
    return user;
};

export const createOAuthUser = async (email, display_name, google_id) => {
    const user = await db.oneOrNone(queries.createOAuthUser, [
        email.trim().toLowerCase(),
        display_name.trim(),
        google_id
    ]);
    return user;
};

export const findOAuthUser = async (google_id) => {
    const user = await db.oneOrNone(queries.checkUserExistsByGoogleId, [google_id]);
    return user;
};

export const linkGoogleToEmail = async (email, google_id) => {
    const user = await db.oneOrNone(queries.updateUserGoogleId, [
        email.trim().toLowerCase(),
        google_id
    ]);
    return user;
};

export const findUserById = async (user_id) => {
    const user = await db.oneOrNone(queries.findUserById, [user_id]);
    return user;
};