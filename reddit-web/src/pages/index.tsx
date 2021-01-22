import { NavBar } from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import { createUrlClient } from "../utils/createUrlClient";
import { usePostsQuery } from "../generated/graphql";
const Index = () => {
    const [{data}] = usePostsQuery();
    return(
        <>
        <NavBar />
        <div>hello world</div>
        {!data ? null : data.getAllPosts.map(p => <div key={p.id}>{p.title}</div>)}
        </>
    )
}


export default withUrqlClient(createUrlClient, { ssr: true } )(Index);;
