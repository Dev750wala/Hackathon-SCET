// import React from 'react'
import Navbar from "./Navbar"
import { ProjectCards } from "./ProjectCard"
// import { Project } from "./ProjectCard"
import Footer from "./Footer"
import { useAppSelector } from "@/redux-store/hooks"
import { ProjectSearchSuccess } from "@/interfaces"

const Home = () => {

    const user = useAppSelector((state) => state.userInfo); 
    // console.log(user);
    console.log(`The user in store ${JSON.stringify(user)}`);


    const sampleProjects: ProjectSearchSuccess[] = [
        {
            id: "1",
            name: "AI-Powered Smart City",
            description: "Develop an AI system to optimize traffic flow, energy usage, and waste management in urban areas.",
            start: new Date("2023-09-01"),
            end: new Date("2023-12-31"),
            maxParticipants: 50,
            techTags: ["AI", "IoT", "Big Data", "Cloud Computing"],
            status: "ongoing",
            organizer: { fullName: "TechInnovate Labs", username: "org1" }
        },
        {
            id: "2",
            name: "Blockchain for Supply Chain",
            description: "Create a blockchain-based solution to enhance transparency and traceability in global supply chains.",
            start: new Date("2023-10-15"),
            end: null,
            maxParticipants: 40,
            techTags: ["Blockchain", "Smart Contracts", "Web3"],
            status: "planned",
            organizer: { fullName: "BlockChain Ventures", username: "org2" }
        },
        {
            id: "3",
            name: "VR Educational Platform",
            description: "Build a virtual reality platform for immersive educational experiences across various subjects.",
            start: new Date("2023-07-01"),
            end: new Date("2023-08-31"),
            maxParticipants: 30,
            techTags: ["VR", "Unity", "3D Modeling", "Education Tech"],
            status: "completed",
            organizer: { fullName: "EduTech Innovations", username: "org3" }
        },
        {
            id: "4",
            name: "Green Energy Marketplace",
            description: "Develop a platform connecting renewable energy producers with consumers, facilitating peer-to-peer energy trading.",
            start: new Date("2023-11-01"),
            end: new Date("2024-02-28"),
            maxParticipants: 45,
            techTags: ["React", "Node.js", "Smart Grid", "Cryptocurrency"],
            status: "planned",
            organizer: { fullName: "GreenTech Solutions", username: "org4" }
        },
        // {
        //     id: "5",
        //     name: "Mental Health AI Chatbot",
        //     description: "Create an AI-powered chatbot to provide mental health support and resources to users.",
        //     start: "2023-08-15",
        //     end: "2023-10-31",
        //     maxParticipants: 35,
        //     techTags: ["NLP", "Machine Learning", "Python", "Healthcare"],
        //     status: "ongoing",
        //     organizer: { name: "HealthTech Innovators", id: "org5" }
        // },
        // {
        //     id: "6",
        //     name: "Augmented Reality Art Gallery",
        //     description: "Design an AR app that transforms public spaces into virtual art galleries, showcasing digital artworks.",
        //     start: "2023-12-01",
        //     maxParticipants: 25,
        //     techTags: ["AR", "Unity", "3D Modeling", "Mobile Development"],
        //     status: "planned",
        //     organizer: { name: "ArtTech Collective", id: "org6" }
        // },
        // {
        //     id: "7",
        //     name: "Decentralized Finance (DeFi) Platform",
        //     description: "Build a DeFi platform that offers lending, borrowing, and yield farming services using smart contracts.",
        //     start: "2023-09-15",
        //     end: "2024-01-15",
        //     maxParticipants: 60,
        //     techTags: ["Ethereum", "Solidity", "Web3.js", "React"],
        //     status: "ongoing",
        //     organizer: { name: "DeFi Innovations", id: "org7" }
        // },
        // {
        //     id: "8",
        //     name: "Sustainable Fashion Tracker",
        //     description: "Create a mobile app that helps consumers track the sustainability and ethical practices of fashion brands.",
        //     start: "2023-10-01",
        //     end: "2023-11-30",
        //     maxParticipants: 20,
        //     techTags: ["React Native", "Node.js", "MongoDB", "Machine Learning"],
        //     status: "completed",
        //     organizer: { name: "EcoFashion Tech", id: "org8" }
        // }
    ];

    return (
        <>
            <Navbar userType="student"/>
            <div className="flex flex-col justify-center w-full h-[85vh] items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-black font-bold text-wrap px-4">
                    Welcome Back {user ? `, ${user.fullName.split(" ")[0]}` : ''}!
                </h1>
            </div>

            {/* div that contains all the upcoming or ongoing events/projects. */}

            <div className="container mx-auto px-4 mt-10">
                <h1 className="text-3xl font-bold my-auto text-slate-950 text-center mb-6">Explore the Projects run by faculty !</h1>
                <hr />
                <ProjectCards projects={sampleProjects} />
            </div>
            <div className="w-full h-fit mb-20 mx-auto flex flex-col items-center">
                <p className="my-1">View more projects</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 animate-up-down">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.25l7.5 7.5 7.5-7.5M4.5 11.25l7.5 7.5 7.5-7.5" />
                </svg>
            </div>
            <Footer />
        </>
    )
}

export default Home