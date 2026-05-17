import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import type { ISignUpRequestModel } from '../../model/account'
import { useForm } from "react-hook-form"
import './SignUp.css'

type Inputs = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    age: number,
    gender: string,
    profilePicture: string,
    bio: string,
    skills: string[],
    location: string
}
const SignUp = () => {
    const signUpMutation = useMutation({
        mutationFn: async (data: any) => {
            return axios.post('http://localhost:3000/api/v1/signup', data)
        },
        onSuccess: (response) => {
            console.log("🚀 ~💀 SignUp.tsx:10 ~💀 SignUp ~💀 response:", response);
            console.log(cookieStore.getAll());
            // const decode = jwtDecode(response?.data?.data?.token);
            // const newResponse = { ...decode, ...response?.data?.data }
            // if (response?.data?.status?.code) {
            //     dispatch(adminLogin(newResponse));
            //     toast.success(response?.data?.status?.message);
            //     permissionMutation.mutate();
            // }

        },
        onError: (error: Error) => { console.log(error?.message) },
    })

    const signUpUser = (values: ISignUpRequestModel) => signUpMutation.mutate(values);

    const { register, handleSubmit, watch, formState: { errors }, } = useForm<Inputs>({
        defaultValues: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password123",
            age: 25,
            gender: "Male",
            profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
            bio: "Full Stack Developer",
            skills: ["React", "Node.js"],
            location: "New York, USA"
        }
    })
    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit(signUpUser)}>
                <h2>Sign Up</h2>
                <input {...register("firstName", { required: true })} placeholder='First Name' />
                <input {...register("lastName", { required: true })} placeholder='Last Name' />
                <input {...register("email", { required: true })} placeholder='Email' type="email" />
                <input {...register("password", { required: true })} placeholder='Password' type="password" />
                <input type="number" {...register("age", { required: true })} placeholder='Age' />
                <input {...register("gender", { required: true })} placeholder='Gender' />
                <input {...register("profilePicture", { required: true })} placeholder='Profile Picture URL' />
                <input {...register("bio", { required: true })} placeholder='Bio' />
                <input {...register("skills", { required: true })} placeholder='Skills (comma separated)' />
                <input {...register("location", { required: true })} placeholder='Location' />
                <button type="submit">Sign Up</button>
            </form>
            
        </div>
    )
}

export default SignUp