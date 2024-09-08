"use client";
import productApiRequest from "@/apiRequests/product";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateProductBody,
  CreateProductBodyType,
} from "@/utils/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
const ProductAddForm = () => {
  // lưu giữ trạng thái hình ảnh
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
  });
  async function onSubmit(values: CreateProductBodyType) {
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const uploadImg = await productApiRequest.uploadImg(formData);
      const imgUrl = uploadImg.payload.data;
      const result = await productApiRequest.create({
        ...values,
        image: imgUrl,
      });
      toast({
        description: result.payload.message,
      });
      router.push("/products");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    placeholder="image"
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFile(file);
                        // set cái name cho thằng img ,
                        field.onChange("http://localhost:3000/" + file.name);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {file && (
            <div>
              <Image
                // cú pháp mình chuyển từ file ảnh , sang 1 cái obj url
                src={URL.createObjectURL(file)}
                width={128}
                height={128}
                alt="preview"
                className="w-32 h-32 object-cover"
              />
              <Button type="button" variant={"destructive"} size={"sm"}>
                Xóa hình ảnh
              </Button>
            </div>
          )}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default ProductAddForm;
