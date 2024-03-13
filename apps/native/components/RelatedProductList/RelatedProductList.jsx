import React from "react";
import Product from "../ProductsList/Product";
import { FlatList } from "react-native";
import { useGetWishlistQuery } from "@store/rtk/apis/wishlistApi";

function RelatedProduct() {
  const data = [
    {
      previewUrl: "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
      title: "DSG mens DSG RACE PRO V2 JACKET",
      category: { _id: "random_id_32423", name: "Biking" },
      isPurchasable: true,
      rentingPrice: 100,
      discountedPrice: 11000,
      originalPrice: 23131,
      showPictures: [
        "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/5161uV9BXAL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/51bOhEXhdrL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/41QZ7+muJhL._SX679_.jpg",
      ],
      description: `<><p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul></>`,
      stars: 3,
      totalFeedbacks: 223,
      shippingPrice: 5,
      isSizeVaries: true,
      isColorVaries: true,
      availableVarients: [
        {
          color: "Red",
          size: "S",
          rentPrice: 10,
          discountedPrice: 12,
          originalPrice: 10,
        },
      ],
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      availableColors: ["Red", "Blue", "Black"],
    },
    {
      previewUrl:
        "https://rukminim2.flixcart.com/image/416/416/l3t2fm80/smartwatch/b/7/n/33-52-sw300-android-ios-syska-yes-original-imageubkesquqz8p.jpeg?q=70&crop=false",
      title: "DSG mens DSG RACE PRO V2 JACKET",
      category: { _id: "random_id_32423", name: "Biking" },
      isRentable: true,
      rentingPrice: 100,
      discountedPrice: 11000,
      showPictures: [
        "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/5161uV9BXAL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/51bOhEXhdrL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/41QZ7+muJhL._SX679_.jpg",
      ],
      description: `<><p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul></>`,
      stars: 3,
      totalFeedbacks: 223,
      shippingPrice: 5,
      isSizeVaries: true,
      isColorVaries: true,
      availableVarients: [
        {
          color: "Red",
          size: "S",
          rentPrice: 10,
          discountedPrice: 12,
          originalPrice: 10,
        },
      ],
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      availableColors: ["Red", "Blue", "Black"],
    },
    {
      previewUrl: "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
      title: "DSG mens DSG RACE PRO V2 JACKET",
      category: { _id: "random_id_32423", name: "Biking" },
      isPurchasable: true,
      rentingPrice: 100,
      discountedPrice: 11000,
      originalPrice: 23131,
      showPictures: [
        "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/5161uV9BXAL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/51bOhEXhdrL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/41QZ7+muJhL._SX679_.jpg",
      ],
      description: `<><p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul></>`,
      stars: 3,
      totalFeedbacks: 223,
      shippingPrice: 5,
      isSizeVaries: true,
      isColorVaries: true,
      availableVarients: [
        {
          color: "Red",
          size: "S",
          rentPrice: 10,
          discountedPrice: 12,
          originalPrice: 10,
        },
      ],
      availableSizes: ["S"],
      availableColors: ["Red"],
    },
    {
      previewUrl: "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
      title: "DSG mens DSG RACE PRO V2 JACKET",
      category: { _id: "random_id_32423", name: "Biking" },
      isRentable: true,
      isPurchasable: true,
      rentingPrice: 100,
      discountedPrice: 11000,
      originalPrice: 23131,
      showPictures: [
        "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/5161uV9BXAL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/51bOhEXhdrL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/41QZ7+muJhL._SX679_.jpg",
      ],
      description: `<><p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul></>`,
      stars: 3,
      totalFeedbacks: 223,
      shippingPrice: 5,
      isSizeVaries: true,
      isColorVaries: true,
      availableVarients: [
        {
          color: "Red",
          size: "S",
          rentPrice: 10,
          discountedPrice: 12,
          originalPrice: 10,
        },
        {
          color: "Blue",
          size: "M",
          rentPrice: 10,
          discountedPrice: 12,
          originalPrice: 10,
        },
      ],
      availableSizes: ["S", "M"],
      availableColors: ["Red", "Blue"],
    },
    {
      previewUrl: "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
      title: "DSG mens DSG RACE PRO V2 JACKET",
      category: { _id: "random_id_32423", name: "Biking" },
      rentingPrice: 100,
      discountedPrice: 11000,
      originalPrice: 23131,
      showPictures: [
        "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/5161uV9BXAL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/51bOhEXhdrL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/41QZ7+muJhL._SX679_.jpg",
      ],
      description: `<><p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul></>`,
      stars: 3,
      totalFeedbacks: 223,
      shippingPrice: 5,
      isSizeVaries: true,
      isColorVaries: true,
      availableVarients: [
        {
          color: "Red",
          size: "S",
          rentPrice: 10,
          discountedPrice: 12,
          originalPrice: 10,
        },
      ],
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      availableColors: ["Red", "Blue", "Black"],
    },
    {
      previewUrl: "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
      title: "DSG mens DSG RACE PRO V2 JACKET",
      category: { _id: "random_id_32423", name: "Biking" },
      rentingPrice: 100,
      discountedPrice: 11000,
      originalPrice: 23131,
      showPictures: [
        "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/5161uV9BXAL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/51bOhEXhdrL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/41QZ7+muJhL._SX679_.jpg",
      ],
      description: `<><p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul></>`,
      stars: 3,
      totalFeedbacks: 223,
      shippingPrice: 5,
      isSizeVaries: true,
      isColorVaries: true,
      availableVarients: [
        {
          color: "Red",
          size: "S",
          rentPrice: 10,
          discountedPrice: 12,
          originalPrice: 10,
        },
      ],
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      availableColors: ["Red", "Blue", "Black"],
    },
  ];

  const {
    data: wishlistData,
    isLoading,
    isError,
    error,
  } = useGetWishlistQuery();

  console.log(wishlistData);
  console.log(error);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => (
        <Product width={"205px"} details={item} wishlistData={wishlistData} />
      )}
      numColumns={1}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default RelatedProduct;
