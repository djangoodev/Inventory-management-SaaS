import {sendRequest, requestMethod} from './BaseApi'

const auth = {
    TRUE: true,
    FALSE: false
};

/**
 * Authentication
 *
 * @returns {Promise}
 */
export async function getMe(){
    return sendRequest(
        'auth/users/me/',
        requestMethod.GET,
        auth.TRUE,
    )
}

export async function checkStore(rqeuestObj){
    return sendRequest(
        'auth/users/check/store/',
        requestMethod.POST,
        auth.FALSE,
        rqeuestObj,
    )
}

export async function signin(rqeuestObj){
    return sendRequest(
        'auth/users/jwt/create',
        requestMethod.POST,
        auth.FALSE,
        rqeuestObj,
    )
}

export async function register(userObj){
    return sendRequest(
        'auth/users/create',
        requestMethod.POST,
        auth.FALSE,
        userObj,
    )
}

export async function activate(userObj){
    return sendRequest(
        'auth/users/activate',
        requestMethod.POST,
        auth.FALSE,
        userObj,
    )
}

export async function updateUser(userObj){
    return sendRequest(
        `auth/users/update/`,
        requestMethod.PUT,
        auth.TRUE,
        userObj,
    )
}

export async function updatePassword(pwd){
    return sendRequest(
        `auth/profile/resetpwd/`,
        requestMethod.POST,
        auth.TRUE,
        pwd,
    )
}

export async function getCurrentSecurity(){
    return sendRequest(
        `auth/security/answer`,
        requestMethod.GET,
        auth.TRUE,
    )
}


export async function confirmCurrentSecurity(answer){
    return sendRequest(
        `auth/security/confirm`,
        requestMethod.POST,
        auth.TRUE,
        answer
    )
}


export async function getSecurityQuestions(){
    return sendRequest(
        `auth/security/questions`,
        requestMethod.GET,
        auth.TRUE,
    )
}

export async function setSecurityAnswer(answer){
    return sendRequest(
        `auth/security/answer`,
        requestMethod.POST,
        auth.TRUE,
        answer
    )
}



/***
 * CRUD for Store
 *
 * @param userObj
 * @returns {Promise<*>}
 */
export async function getStoreInfo(){
    return sendRequest(
        `auth/company/entity/`,
        requestMethod.GET,
        auth.TRUE,
    )
}

export async function updateStore(userObj, id){
    return sendRequest(
        `auth/company/update/${id}/`,
        requestMethod.PUT,
        auth.TRUE,
        userObj,
    )
}





/**
 *
 * category CRUD
 *
 * @returns {Promise}
 */
export async function getTopCategories(){
    return sendRequest(
        'category/category/top',
        requestMethod.GET,
        auth.TRUE,
    )
}

export async function getCategoryParallels(){
    return sendRequest(
        'category/category/parallel',
        requestMethod.GET,
        auth.TRUE,
    )
}

export async function createCategory(rqeuestObj){
    return sendRequest(
        'category/category/create',
        requestMethod.POST,
        auth.TRUE,
        rqeuestObj
    )
}

export async function updateCategory(rqeuestObj, id){
    return sendRequest(
        'category/category/' + id + '/update',
        requestMethod.PUT,
        auth.TRUE,
        rqeuestObj
    )
}

export async function deleteCategory(rqeuestObj){
    return sendRequest(
        'category/category/' + rqeuestObj.id + '/delete',
        requestMethod.DELETE,
        auth.TRUE
    )
}


/**
 *
 * category Product
 *
 * @returns {Promise}
 */

export async function getProduct(id){
    return sendRequest(
        `product/${id}`,
        requestMethod.GET,
        auth.TRUE,
    )
}

export async function createProduct(rqeuestObj){
    return sendRequest(
        'product/create',
        requestMethod.POST,
        auth.TRUE,
        rqeuestObj
    )
}

export async function updateProduct(rqeuestObj){
    return sendRequest(
        `product/update/${rqeuestObj.id}`,
        requestMethod.PUT,
        auth.TRUE,
        rqeuestObj
    )
}

export async function deleteProduct(id){
    return sendRequest(
        `product/delete/${id}`,
        requestMethod.DELETE,
        auth.TRUE,
    )
}

export async function getProducts(){
    return sendRequest(
        'product/list',
        requestMethod.GET,
        auth.TRUE,
    )
}

/***
 * send SMS code over twilio
 * @param userObj
 * @returns {Promise<*>}
 */
export async function sendSMSCode(userObj){
    return sendRequest(
        `auth/users/sms/`,
        requestMethod.POST,
        auth.TRUE,
        userObj,
    )
}

export async function checkSMSCode(userObj){
    return sendRequest(
        `auth/users/sms/verify/`,
        requestMethod.POST,
        auth.TRUE,
        userObj,
    )
}


