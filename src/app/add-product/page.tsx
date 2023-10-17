import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";
import FormSubmitButton from "../components/FormSubmitButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
    title: 'Add Product - Flowmazon'
}

async function addProduct(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/add-product")
    }

    const name = formData.get('name')?.toString()
    const description = formData.get('description')?.toString()
    const imageUrl = formData.get('imageUrl')?.toString()
    const price = Number(formData.get('price') || 0)

    if (!name || !description || !imageUrl || !price) {
        return Error('Missing required fields')
    }

    await prisma.product.create({
        data: {
            name,
            description,
            imageUrl,
            price
        }
    })

    redirect("/")
}

export default async function AddProductPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/add-product")
    }
    return (
        <div>
            <h1 className="text-lg mb-3 font-bold">Add Product</h1>
            <form action={addProduct}>
                <input className="mb-3 w-full input input-bordered" required name="name" placeholder="Name" />
                <textarea className="mb-3 w-full textarea textarea-bordered" required name="description" placeholder="Description" />
                <input className="mb-3 w-full input input-bordered" required type="url" name="imageUrl" placeholder="Image URL" />
                <input className="mb-3 w-full input input-bordered" required type="number" name="price" placeholder="Price" />
                <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
            </form>
        </div>
    )
}