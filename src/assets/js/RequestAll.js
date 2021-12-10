import {GetUrl, PostUrl} from "../js/MyAxios"
import {CheckValueLength, CheckValueIsNumber} from "../js/Common"

export async function PostUserNew(data) {
    return await PostUrl("/user/new", data)
}

export async function PostUserLogin(data) {
    return await PostUrl("/user/login", data);
}

export async function PostIllustratorNew(data) {
    return await PostUrl("/illustrator/new", data);
}

export async function PostIllustratorAddArts(id, imgList) {
    return await PostUrl(`/illustrator/add_arts/${id}`, imgList);
}

export async function GetIllustratorAll() {
    return await GetUrl("/illustrator/all");
}

export async function GetIllustrator(id) {
   return await GetUrl(`/illustrator/${id}`);
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

export async function ImageUpload(data) {
    let formData = new FormData()
    formData.append('file', data.file,data.file.name)
    formData.append('src',data.src );
    // const blob = new Blob([data.file], {type: data.file.type});

    return await PostUrl(`/images/upload`, formData);
}
