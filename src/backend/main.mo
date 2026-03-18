import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";

actor {
  // Types
  type RoomType = {
    #single;
    #double;
    #triple;
  };

  type RoomListing = {
    id : Nat;
    roomType : RoomType;
    priceWithoutFood : Nat;
    priceWithFood : Nat;
    amenities : [Text];
    isAvailable : Bool;
  };

  type Booking = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    roomType : RoomType;
    moveInDate : Int;
    message : Text;
    submittedAt : Int;
  };

  type BlogPost = {
    id : Nat;
    title : Text;
    slug : Text;
    content : Text;
    excerpt : Text;
    publishedAt : Int;
  };

  type Inquiry = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    message : Text;
    submittedAt : Int;
  };

  var currentRoomId = 0;
  var currentBookingId = 0;
  var currentBlogPostId = 0;
  var currentInquiryId = 0;

  let roomListings = Map.empty<Nat, RoomListing>();
  let bookings = Map.empty<Nat, Booking>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let inquiries = Map.empty<Nat, Inquiry>();

  module RoomListing {
    public func compareByAvailability(a : RoomListing, b : RoomListing) : Order.Order {
      Nat.compare(a.priceWithoutFood, b.priceWithoutFood);
    };
  };

  // Room Listings
  public shared ({ caller }) func addRoomListing(roomType : RoomType, priceWithoutFood : Nat, priceWithFood : Nat, amenities : [Text], isAvailable : Bool) : async Nat {
    let id = currentRoomId;
    let listing : RoomListing = {
      id;
      roomType;
      priceWithoutFood;
      priceWithFood;
      amenities;
      isAvailable;
    };
    roomListings.add(id, listing);
    currentRoomId += 1;
    id;
  };

  public query ({ caller }) func getRoomListing(id : Nat) : async RoomListing {
    switch (roomListings.get(id)) {
      case (null) { Runtime.trap("Room listing does not exist") };
      case (?listing) { listing };
    };
  };

  public query ({ caller }) func getAllRoomListings() : async [RoomListing] {
    roomListings.values().toArray();
  };

  // Bookings
  public shared ({ caller }) func submitBooking(name : Text, phone : Text, email : Text, roomType : RoomType, moveInDate : Int, message : Text) : async Nat {
    let id = currentBookingId;
    let booking : Booking = {
      id;
      name;
      phone;
      email;
      roomType;
      moveInDate;
      message;
      submittedAt = Time.now();
    };
    bookings.add(id, booking);
    currentBookingId += 1;
    id;
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

  // Blog Posts
  public shared ({ caller }) func addBlogPost(title : Text, slug : Text, content : Text, excerpt : Text) : async Nat {
    let id = currentBlogPostId;
    let post : BlogPost = {
      id;
      title;
      slug;
      content;
      excerpt;
      publishedAt = Time.now();
    };
    blogPosts.add(id, post);
    currentBlogPostId += 1;
    id;
  };

  public query ({ caller }) func getBlogPostBySlug(slug : Text) : async BlogPost {
    switch (blogPosts.values().find(func(post) { post.slug == slug })) {
      case (null) { Runtime.trap("Post with this slug does not exist") };
      case (?post) { post };
    };
  };

  public query ({ caller }) func listAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray();
  };

  // Inquiries
  public shared ({ caller }) func submitInquiry(name : Text, phone : Text, email : Text, message : Text) : async Nat {
    let id = currentInquiryId;
    let inquiry : Inquiry = {
      id;
      name;
      phone;
      email;
      message;
      submittedAt = Time.now();
    };
    inquiries.add(id, inquiry);
    currentInquiryId += 1;
    id;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    inquiries.values().toArray();
  };
};
