import {GetUrl, PostUrl} from "../js/MyAxios"
import {CheckValueLength, CheckValueIsNumber} from "../js/Common"

export function PostUserNew(data) {
    let check = CheckValueLength(data.name, "名称")
    if (!check.code) {
        return check
    }
    check = CheckValueLength(data.pwd, "密码")
    if (!check.code) {
        return check
    }
    if (data.qq) {
        data.qq = parseInt(data.qq);
    }
    return {code: true, data: PostUrl("/user/new", data)}
}

export async function PostUserLogin(qq, pwd) {
    let check = CheckValueLength(qq, "名称")
    if (!check.code) {
        return check
    }
    check = CheckValueLength(pwd, "密码")
    if (!check.code) {
        return check
    }
    let result = await PostUrl("/user/login", {
        qq, pwd
    });
    return {code: 1000, data: result};
}

export async function PostIllustratorNew(name, home) {
    let check = CheckValueLength(name, "画师名称", 1, 32)
    if (!check.code) {
        return check
    }
    check = CheckValueLength(home, "画师地址", 0, 256)
    if (!check.code) {
        return check
    }
    let result = await PostUrl("/illustrator/new", {
        name, home
    });
    return {code: 1000, data: result};
}

export async function PostIllustratorAddArts(id, file) {
    let result = await PostUrl(`/illustrator/add_arts/${id}`, file);
    return {code: 1000, data: result};
}

export async function GetIllustratorAll() {
    let result = await GetUrl("/illustrator/all");
    return {code: 1000, data: result};
}

export async function GetIllustrator(id) {
    let result = await GetUrl(`/illustrator/${id}`);
    return {code: 1000, data: result};
}

export async function PostIllustrator(id) {
    let result = await PostUrl(`/illustrator/${id}`);
    return {code: 1000, data: result};
}

export async function PostAdminNew() {
    let result = await PostUrl(`/admin/new`);
    return {code: 1000, data: result};
}

export function PostAdminLogin(data) {
    return {code: true, data: PostUrl(`/admin/login`, data)}
}

export async function PostAdminAudit(name) {
    let result = await PostUrl(`/admin/audit/${name}`);
    return {code: 1000, data: result};
}

export async function PostAdminInvite() {
    let result = await PostUrl(`/admin/invite`);
    return {code: 1000, data: result};
}

export async function GetImage(path) {
    let result = await GetUrl(`/images/${path}`);
    return {code: 1000, data: result};
}
