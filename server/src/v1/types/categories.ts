export interface CreateCategoryInput { 
    name: string;
    slug: string;
}


export interface UpdateCategoryInput { 
    name?: string;
    slug?: string;
}