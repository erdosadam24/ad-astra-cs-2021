import { CommentData } from "./comment-data";

export interface FileData{
    FileId: string,
    FileName: string,
    Author:string,
    UserID: string,
    Created: string,
	Data: string,
    Comments: Array<CommentData>
}