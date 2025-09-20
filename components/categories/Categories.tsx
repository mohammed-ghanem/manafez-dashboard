"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActCategories, categoriesCleanRecord } from "@/store/categories/categoriesSlice";
import { useEffect } from "react";
import Link from "next/link";
// translate
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import Image from "next/image";



const Categories = () => {
  const lang = LangUseParams() // Access dynamic [lang] parameter
  const translate = TranslateHook(); // Access dynamic [lang] parameter

  const dispatch = useAppDispatch();
  const { loading, record, error } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(ActCategories());

    return () => {
      dispatch(categoriesCleanRecord());
    };

  }, [dispatch]);

  const categoriesList =
    loading === "pending" || loading === "idle" ? (
      <div> {translate ? translate.loading.title : ""}</div>
    ) : loading === "failed" ? (
      <div>{error || "Error fetching categories"}</div>
    ) : record.length > 0 ? (
      record.map((category) => (
        <div key={category.id}>
          <Link href={`/${lang}/products/${category.id}`}>
            <Image src={category.image} alt={category.name} width="150" height="150" />
            <h1>{category.name}</h1>
          </Link>
        </div>
      ))
    ) : (
      <div>No categories</div>
    );

  return <div className="container mx-auto grid grid-cols-4 gap-4 mt-10">{categoriesList}</div>;
};

export default Categories;
