import { RoleAction, RoleFunction } from "../model/role";
import { ADD_ACTION, DELETE_ACTION, EDIT_ACTION } from "../roleConfig";

export interface IAssignmentType {
    type: number,
    content: string,
    color?: string
}

export enum AssignmentType {
    test = 0,
    lesson = 1,
    exercise = 2,
    assignment = 3,
    zoom = 4,
    showkey = 5,
    google_meet = 6,
    acellus = 7,
    home_school = 8,
    extra_exercise = 9
}
export enum ClassType {
    normal = 0,
    acellus = 1,
    ics = 2,
    for_head_teacher = 3
}
export enum AssignStudentType {
    init = 0,
    exist_for_another_teacher = 1,
    success = 2,
    error = 3
}
export enum FeedbackType {
    normal = 0,
    classes = 1,
    assignment = 2
}

export enum ICSDocumentType {
    all = 0,
    teacher = 1,
    student = 2
}


export enum ClassManagerLabel {
    register = "6076c8f34181cd38009c6fcf",
    test_finished = "6076da780900f54dc2b9a140",
    order_success = "6076dbe2b188474eee7c6fa7",
    test_progress = "617661189718e827a29ff21e",
    acellus = "6076c95d4181cd38009c6fd0",
    ics = "6076ca7b062f733b5580cbdb"
}

export enum ExcercisePassStatus {
    pass = 0,
    fail = 1
}
class ClassesManagerConfig {
    static ASSIGNMENT_TYPE_WAITTING = 0;
    static ASSIGNMENT_TYPE_PROCESSING = 1;
    static ASSIGNMENT_TYPE_MISS_DEADLINE = 2;
    static ASSIGNMENT_TYPE_DONE = 4;
    static ASSIGNMENT_TYPE_WAIT_TEACHER_REVIEW = 3;
    static USER_CLASSES_TYPE_STUDY_FINISHED = 5;
    static USER_CLASSES_TYPE_STUDY_LEARNING = 6;
    static USER_CLASSES_TYPE_STUDY_WAITTING_PURCHASE = 7;
    static USER_CLASSES_TYPE_TRIAL = 8;
    static USER_CLASSES_TYPE_BLOCKED = 9;


    static CLASSES_TYPE_ELEARNING_SYSTEM = 0;
    static CLASSES_TYPE_IXL_SYSTEM = 1;
    static CLASSES_TYPE_EXTRACURRICULAR = 2;
    static ROLE_ID_CLASSES_MANAGER = "60b1b0bb100e7a4b4911123f";
    static ROLE_ID_CLASSES_CONTENT_MANAGE = "60b1b0f781b0574b8efcd25e";
    static ROLE_ID_CLASSES_PARENT = "60b1b1823eba354ca8a6f6a1";
    static ROLE_ID_CLASSES_TEACHER = "61244f5580c192db2ec6bb4e";
    static getAssignmentType = (): IAssignmentType[] => {
        return [
            {
                type: AssignmentType.extra_exercise,
                content: "Extra-Excercise",
                color: "#cc0000"
            },
            {
                type: AssignmentType.test,
                content: "Test",
                color: "#A2C400"
            },
            {
                type: AssignmentType.exercise,
                content: "Exercise",
                color: "#784BFA"
            },
            {
                type: AssignmentType.lesson,
                content: "Lessons",
                color: "#1AAFA6"
            },
            {
                type: AssignmentType.assignment,
                content: "Assignment",
                color: "#3333CC"
            },
            {
                type: AssignmentType.zoom,
                content: "Zoom",
                color: "#4B8FFA"
            },
            {
                type: AssignmentType.showkey,
                content: "Showcase",
                color: "##F86D70"
            },
            {
                type: AssignmentType.google_meet,
                content: "Google meet",
                color: "#9E43F7"
            },

            {
                type: AssignmentType.acellus,
                content: "Acellus",
                color: "#39D4CA"
            },
            {
                type: AssignmentType.home_school,
                content: "Home School",
                color: "#D47239"
            },

        ];
    }

    startAndEndOfWeek = (date: number) => {
        var weekMap: number[] = [6, 0, 1, 2, 3, 4, 5];
        var now = new Date(date);
        now.setHours(0, 0, 0, 0);
        var monday = new Date(now);
        monday.setDate(monday.getDate() - weekMap[monday.getDay()]);
        var sunday = new Date(now);
        sunday.setDate(sunday.getDate() - weekMap[sunday.getDay()] + 6);
        sunday.setHours(23, 59, 59, 999);
        return { monday: monday.getTime(), sunday: sunday.getTime() };
    }

    static getRoleActions = (): RoleAction[] => {
        return [
            {
                id: ADD_ACTION,
                name: "Thêm"
            },
            {
                id: EDIT_ACTION,
                name: "Sửa"
            },
            {
                id: DELETE_ACTION,
                name: "Xóa"
            }
        ]
    }
    static getRoleFunctions = (): RoleFunction[] => {
        return [
            {
                id: 200,
                name: " Quản lí Lớp học",
                actions: ClassesManagerConfig.getRoleActions().map((item) => item.id)
            },
            {
                id: 201,
                name: " Quản lí học sinh",
                actions: ClassesManagerConfig.getRoleActions().map((item) => item.id)
            },
            {
                id: 201,
                name: " Quản lí phụ huynh",
                actions: ClassesManagerConfig.getRoleActions().map((item) => item.id)
            },
            {
                id: 202,
                name: " Quản lí giáo viên",
                actions: ClassesManagerConfig.getRoleActions().map((item) => item.id)
            },
            {
                id: 203,
                name: " Quản lí thông báo",
                actions: ClassesManagerConfig.getRoleActions().map((item) => item.id)
            },
            {
                id: 204,
                name: " Quản lí sự kiện",
                actions: ClassesManagerConfig.getRoleActions().map((item) => item.id)
            },
        ]
    }
}

export { ClassesManagerConfig }