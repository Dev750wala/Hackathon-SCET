import { useParams } from "react-router-dom"

const ProjectDetail = () => {
    const { projectId } = useParams<{ projectId: string }>()
    return (
        <div>{projectId}</div>
    )
}

export default ProjectDetail