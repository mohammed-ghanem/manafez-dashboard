"use client";

import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActProducts, productCleanRecord } from "@/store/products/productsSlice";
import Image from "next/image";
import { useEffect } from "react";
import type { IProduct } from "@/types/product";
import { addToCartThunk } from "@/store/cart/thunkActions/ActCart";
import WishlistToggle from "../toggleBtnWishlist/WishlistToggle";


const ProductsCard = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useAppDispatch();
  const { loading, record, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (categoryId) {
      dispatch(ActProducts(Number(categoryId)));
      return () => {
        dispatch(productCleanRecord());
      };
    }
  }, [dispatch, categoryId]);

  if (loading === "pending" || loading === "idle") return <div>Loading...</div>;
  if (loading === "failed") return <div>{error}</div>;
  if (!record.length) return <div>No products in this category</div>;

  const handleAddToCart = (product: IProduct) => {
    dispatch(addToCartThunk(product));
  };


  return (
    <div className="container mx-auto grid grid-cols-4 gap-4 mt-10">
      {record.map((product) => (
        <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
          <h2>{product.title}</h2>
          <p>${product.price}</p>
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              width={150}
              height={150}
            />
          )}
          <button
            onClick={() => handleAddToCart(product)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 cursor-pointer"
          >
            Add to Cart
          </button>

          <WishlistToggle product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductsCard;






// "use client";

// import { useParams } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { ActProducts, productCleanRecord } from "@/store/products/productsSlice";
// import Image from "next/image";
// import { useEffect } from "react";
// import type { IProduct } from "@/types/product";
// import { addToCart } from "@/store/cart/cartSlice";

// const ProductsCard = () => {
//   const { categoryId } = useParams<{ categoryId: string }>();
//   const dispatch = useAppDispatch();
//   const { loading, record, error } = useAppSelector((state) => state.products);




//   useEffect(() => {
//     if (categoryId) {
//       dispatch(ActProducts(Number(categoryId)));
//       return () => {
//         dispatch(productCleanRecord());
//       };
//     }
//   }, [dispatch, categoryId]);

//   if (loading === "pending" || loading === "idle") {
//     return <div>Loading...</div>;
//   }

//   if (loading === "failed") {
//     return <div>{error}</div>;
//   }

//   if (!record.length) {
//     return <div>No products in this category</div>;
//   }

//   const handleAddToCart = (product: IProduct) => {
//     dispatch(addToCart(product));
//   }


//   const fetchRecordData = record.map((product) => (
//     <div
//       className="bg-white p-4 rounded-lg shadow-md"
//       key={product.id}>
//       <h2>{product.title}</h2>
//       <p>${product.price}</p>
//       {product.images?.[0] && (
//         <Image src={product.images[0]} alt={product.title} width="150" height="150" />
//       )}
//       <button
//         onClick={() => handleAddToCart(product as IProduct)}
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-2 cursor-pointer">
//         Add to Cart
//       </button>
//     </div>
//   ))



//   return (
//     <div className=" container mx-auto grid grid-cols-4 gap-4 mt-10">
//       {fetchRecordData}
//     </div>
//   );
// };

// export default ProductsCard;
