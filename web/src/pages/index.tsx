import { NavBar } from '../components/NavbBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar/>
      {!data ? <div>Loading...</div> : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)