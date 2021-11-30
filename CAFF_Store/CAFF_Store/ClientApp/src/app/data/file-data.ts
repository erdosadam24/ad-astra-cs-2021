import { CommentData } from "./comment-data";

export interface FileData{
    FileName: string,
    Author:string,
    UserID: string,
    Created: string,
	Data: string,
    Comments: Array<CommentData>
}