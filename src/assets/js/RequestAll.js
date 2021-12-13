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
    return await PostUrl(`/illustrator/${id}`);
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

    formData.append('src', data.src);
    formData.append('file', data.file, data.file.name)

    return await PostUrl(`/images/upload`, formData);
}

export async function ImageUploads(data) {
    let list = [];
    data.map(file => {
        list.push(ImageUpload({file:file.file, src: file.source}));
    })
    let result = await Promise.all(list);
    let resultList = [];
    result.forEach(item => {
        if (item.code) {
            resultList.push(item.data);
        }
    });
    return {code: true, data: resultList};
    // let formData = new FormData()
    // formData.append('fileSource', data.map(x => x.source).join(","));
    // data.map(file => {
    //     formData.append('file', file.file, file.file.name)
    // })
    // return await PostUrl(`/images/uploads`, formData);
}
