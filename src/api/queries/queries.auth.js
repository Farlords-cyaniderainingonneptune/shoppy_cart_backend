export default {
    checkUserExistsByEmail: 'SELECT id, email FROM users WHERE email = $1',
    createAdmin: `
    INSERT INTO users (email, display_name, google_id, verification_code, verification_code_expire_at) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, email, user_id, display_name, verification_code_expire_at, created_at`,
    checkIfUserActivelyExistsBygoogleId: `
    SELECT id, user_id, 
    email, google_id, 
    is_verified_account, verification_code, 
    verification_code_expire_at FROM users
    WHERE google_id = $1 
    AND is_deleted = false
    AND status = 'active'
    `,
    updateUserAccountVerification: `
    UPDATE users
    SET updated_at = NOW(),
    is_verified_account = true,
    status = 'active',
    verification_code = NULL,
    verification_code_expire_at = NULL
    WHERE email = $1
    RETURNING id, user_id, email, full_name, is_verified_account, status, created_at, updated_at`,
    updateUserVerificationCode: `
    UPDATE users 
    SET updated_at = NOW(), 
    verification_code = $2, 
    verification_code_expire_at = $3 
    WHERE email = $1 
    RETURNING id, user_id, email, verification_code_expire_at`,
    checkIfUserActivelyExistsByUserId: `
    SELECT id, user_id, 
    email, display_name, is_verified_account, 
    status, created_at 
    FROM users 
    WHERE user_id = $1 
    AND is_deleted = false 
    AND status = 'active'`,
    checkIfUserExistsByUserId: `
    SELECT id, user_id, ip_address,
    email, username, is_verified_account, 
    status, created_at, verification_code,
    verification_code_expire_at
    FROM users 
    WHERE user_id = $1 
    AND is_deleted = false `,
    userPassword: `SELECT id, user_id, password FROM users 
    WHERE user_id = $1 
    AND is_deleted = false`,
    updateAdminOnLogin: `UPDATE users SET updated_at = NOW(), 
    last_login_at = NOW(), 
    status = 'active', 
    role ='admin', 
    current_roles = 'admin',
    logged_in = true
    WHERE user_id = $1
    RETURNING id, user_id, email, full_name, role, current_roles, status`,
    // updateUserPassword:`
    // UPDATE users
    // SET updated_at = NOW(), 
    // status = 'active', 
    // password= $2 
    // WHERE email = $1 
    // RETURNING id, user_id, email, full_name`,
    checkIfActualAdmin: `
    SELECT user_id, role, status 
    FROM users 
    WHERE user_id = $1 
    AND roles = $2
    AND status = $3
    `,
    checkIfWasAdmin: `
    SELECT user_id, role, status 
    FROM users 
    WHERE user_id = $1 
    AND role = $2
    `,
    checkIfUserActive:`
    SELECT user_id, status 
    FROM users 
    WHERE user_id= $1 AND status= 'active'
    AND is_deleted = false
    `,
    countUser:`
    SELECT COUNT(id)
    FROM users 
    WHERE is_verified_account = true
    AND is_deleted = false
    `,
    fetchRecentUsers:`
    SELECT * FROM users
    WHERE is_deleted = false
    AND status = 'active'
    ORDER BY last_login_at DESC NULLS LAST
    LIMIT $1
    `,
    isLoggedIn:`
    SELECT user_id, display_name, status
    FROM users 
    WHERE user_id = $1 AND logged_in = true
    `,
    updateUseronLogout:`
    UPDATE users
    SET updated_at = NOW(),
    last_login_at = NOW(),
    logged_in = false
    WHERE user_id = $1
    RETURNING user_id, logged_in
    `,
    updateAdminOnLogout: `UPDATE users 
    SET updated_at = NOW(), 
    last_login_at = NOW(), 
    status = 'active', 
    role ='admin',
    logged_in = false
    WHERE user_id = $1
    RETURNING *
    `,
    checkIfAdmin:
    `SELECT user_id, status, role
    FROM users
    WHERE user_id = $1
    AND roles IN ('admin')
    AND status = 'active' 
    `,
    editUserInfo:`
    UPDATE users
    SET updated_at = NOW(),
    display_name = COALESCE($2, display_name)
    WHERE user_id = $1
    RETURNING user_id, email, full_name
    `,
    updateVerifiedAdmin:`
    UPDATE users
    SET updated_at = NOW(),
    is_verified_account = true,
    status = 'active',
    role = 'admin',
    verification_code = NULL,
    verification_code_expire_at = NULL
    WHERE email = $1
    RETURNING id, user_id, email, full_name, is_verified_account, status, role, created_at, updated_at
   `,
    createOAuthUser: `
    INSERT INTO users (email, display_name, google_id, is_verified_account, status)
    VALUES ($1, $2, $3, true, 'active')
    RETURNING id, user_id, email, display_name, google_id, is_verified_account, status, created_at`,
    updateUserGoogleId: `
    UPDATE users
    SET updated_at = NOW(),
    google_id = $2,
    is_verified_account = true
    WHERE email = $1
    RETURNING id, user_id, email, display_name, google_id, is_verified_account, status`,
    checkUserExistsByGoogleId: `
    SELECT id, user_id, email, display_name, google_id, is_verified_account, status
    FROM users
    WHERE google_id = $1
    AND is_deleted = false
    LIMIT 1`,
    findUserById: `
    SELECT id, user_id, email, display_name, google_id, is_verified_account, status
    FROM users
    WHERE user_id = $1
    AND is_deleted = false`,
}