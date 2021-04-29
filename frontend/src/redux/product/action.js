import {
    EDIT_PRODUCT
} from '../constants/';

export const editProduct = (payload) => {
    return {
        type: EDIT_PRODUCT,
        payload
    }
};
