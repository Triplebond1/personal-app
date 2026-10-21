export interface CreateTagInput { 
    name: string;
    slug: string;
}

export interface UpdateTagInput { 
    name?: string;
    slug?: string;
}