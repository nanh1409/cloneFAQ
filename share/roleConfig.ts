export const ADD_ACTION = 1
export const EDIT_ACTION = 2
export const DELETE_ACTION = 3

export const MANAGE_COURSE_FUNCTION = 1
export const MANAGE_STUDENT_FUNCTION = 2

export const COURSE_SCOPE = 0
export const CATEGORY_SCOPE = 1
export const SYSTEM_SCOPE = 2

export const initRoleActions = [
    {
        id: ADD_ACTION,
        name: 'Thêm',
        isActive: false
    },
    {
        id: EDIT_ACTION,
        name: 'Sửa',
        isActive: false
    },
    {
        id: DELETE_ACTION,
        name: 'Xóa',
        isActive: false
    },
]

export const initRoleFunctions = [
    {
        id: 1,
        name: 'Quản lý khoá học',
        isActive: false,
        actions: [
            {
                id: 1,
                name: 'Thêm',
                isActive: false
            },
            {
                id: 2,
                name: 'Sửa',
                isActive: false
            },
            {
                id: 3,
                name: 'Xóa',
                isActive: false
            },
        ]
    },
    {
        id: 2,
        name: 'Quản lý học viên',
        isActive: false,
        actions: [
            {
                id: 1,
                name: 'Thêm',
                isActive: false
            },
            {
                id: 2,
                name: 'Sửa',
                isActive: false
            },
            {
                id: 3,
                name: 'Xóa',
                isActive: false
            },
        ]
    }
]

export const initScopes = [
    {
        id: COURSE_SCOPE,
        name: 'Khóa học',
        isActive: true
    },
    {
        id: CATEGORY_SCOPE,
        name: 'Danh mục',
        isActive: false
    },
    {
        id: SYSTEM_SCOPE,
        name: 'Hệ thống',
        isActive: false
    },
]