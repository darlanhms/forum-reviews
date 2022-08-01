import type { NextPage } from 'next';
import { useTRPC } from 'common/hooks/useTRPC';

const Home: NextPage = () => {
  const { useQuery } = useTRPC();

  const { data: members } = useQuery(['members.getAll'], {});

  return (
    <div>
      {members?.map(member => (
        <h1 key={member.name}>{member.name}</h1>
      ))}
    </div>
  );
};

export default Home;
