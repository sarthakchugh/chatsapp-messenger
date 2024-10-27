export const HOST = import.meta.env.VITE_API_URL;

export const AUTH_ROUTE = 'api/auth';
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;
export const GET_USER_INFO = `${AUTH_ROUTE}/userInfo`;

export const PROFILE_ROUTE = 'api/profile';
export const UPDATE_PROFILE_ROUTE = `${PROFILE_ROUTE}/update`;
export const UPDATE_PROFILE_IMAGE_ROUTE = `${PROFILE_ROUTE}/update/profile-image`;
export const DELETE_PROFILE_IMAGE_ROUTE = `${PROFILE_ROUTE}/delete/profile-image`;

export const CONTACT_ROUTE = 'api/contacts';
export const SEARCH_CONTACTS_ROUTE = `${CONTACT_ROUTE}/search`;
export const GET_CONTACT_LIST_ROUTE = `${CONTACT_ROUTE}/getList`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTE}/getAll`;

export const MESSAGE_ROUTE = 'api/messages';
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTE}/upload`;

export const CHANNEL_ROUTE = 'api/channel';
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create`;
