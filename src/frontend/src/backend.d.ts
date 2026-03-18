import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    slug: string;
    publishedAt: bigint;
    excerpt: string;
}
export interface RoomListing {
    id: bigint;
    priceWithFood: bigint;
    isAvailable: boolean;
    amenities: Array<string>;
    priceWithoutFood: bigint;
    roomType: RoomType;
}
export interface Booking {
    id: bigint;
    name: string;
    submittedAt: bigint;
    email: string;
    message: string;
    phone: string;
    moveInDate: bigint;
    roomType: RoomType;
}
export interface Inquiry {
    id: bigint;
    name: string;
    submittedAt: bigint;
    email: string;
    message: string;
    phone: string;
}
export enum RoomType {
    double_ = "double",
    triple = "triple",
    single = "single"
}
export interface backendInterface {
    addBlogPost(title: string, slug: string, content: string, excerpt: string): Promise<bigint>;
    addRoomListing(roomType: RoomType, priceWithoutFood: bigint, priceWithFood: bigint, amenities: Array<string>, isAvailable: boolean): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllRoomListings(): Promise<Array<RoomListing>>;
    getBlogPostBySlug(slug: string): Promise<BlogPost>;
    getRoomListing(id: bigint): Promise<RoomListing>;
    listAllBlogPosts(): Promise<Array<BlogPost>>;
    submitBooking(name: string, phone: string, email: string, roomType: RoomType, moveInDate: bigint, message: string): Promise<bigint>;
    submitInquiry(name: string, phone: string, email: string, message: string): Promise<bigint>;
}
