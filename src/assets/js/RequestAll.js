import {GetUrl, PostUrl} from "../js/MyAxios"
import {CheckValueLength, CheckValueIsNumber} from "../js/Common"

export async function PostUserNew(data) {
    if (data.qq) {
        data.qq = parseInt(data.qq);
    }
    return await PostUrl("/user/new", data)
}

export async function PostUserLogin(data) {
    if (data.qq) {
        data.qq = parseInt(data.qq);
    }
    let result = await PostUrl("/user/login", data);
    return result;
}

export async function PostIllustratorNew(data) {
    let result = await PostUrl("/illustrator/new", data);
    return result;
}

export async function PostIllustratorAddArts(id, imgList) {
    return await PostUrl(`/illustrator/add_arts/${id}`, imgList);
}

export async function GetIllustratorAll() {
    return await GetUrl("/illustrator/all");
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

export async function PostAdminLogin(data) {
    let check = CheckValueLength(data.qq, "名称")
    if (!check.code) {
        return check
    }
    check = CheckValueLength(data.password, "密码")
    if (!check.code) {
        return check
    }
    let result = await PostUrl(`/admin/login`, data);
    return result;
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
    return await GetUrl(`/images/${path}`);
}

export async function ImageUpload(file) {
    const blob = new Blob([file], {type: file.type});
    return await PostUrl(`/images/upload`,blob);
}
