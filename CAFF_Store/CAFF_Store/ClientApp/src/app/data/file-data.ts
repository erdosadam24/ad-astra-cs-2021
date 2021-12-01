import { CommentData } from './comment-data';

export interface FileData{
    fileName: string,
    author:string,
    created: string,
    data: string,
    cover: string,
    comments: Array<CommentData>
}
