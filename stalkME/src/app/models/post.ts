export class Post {
    constructor(
        public _id: string,
        public text: string,
        public file: string,
        public CreatedAt: string,
        public user: string) {
    }
}