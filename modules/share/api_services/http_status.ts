export enum response_status_codes {
    success = 200,
    bad_request = 400,
    client_error = 401,
    not_found = 404,
    forbbiden_req = 403,
    invalid_method = 405,
    internal_server_error = 500,
}

export enum response_status {
    success = 0,
    failure = 1,
    null_or_undefined_params = 2
}

export interface SucessResponse {
    status: number,
    message: string,
    data: any
}