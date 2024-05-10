import React from "react";
import Product from "../ProductSection/Product";
import { FlatList } from "react-native";
import { useGetWishlistQuery } from "@store/rtk";

function RelatedProduct() {
  const router = useRouter();
  const jwtToken = useSelector((state) => state.auth.jwtToken);
  const { productType } = useSelector((state) => state.product_store);

  const [data, setData] = useState([]);
  const [isProductDataLoading, setIsProductDataLoading] = useState(true);

  const getProductData = async () => {
    try {
      setIsProductDataLoading(true);

      const url = new URL(`${process.env.EXPO_PUBLIC_API_URL}/products`);

      url.searchParams.append("productType", viewAllPath);
      url.searchParams.append("limit", 10);

      if (!!sort) {
        url.searchParams.append("sort", sort);
      }

      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });
      // console.log(res.data.data);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProductDataLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  const {
    data: wishlistData,
    isLoading,
    isError,
    error,
  } = useGetWishlistQuery();

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
