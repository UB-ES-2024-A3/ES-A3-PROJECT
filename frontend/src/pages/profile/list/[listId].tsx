import NavBar from '@/components/navbar';
import ListContents from '@/components/list_content';

interface ListProfileProps{

}

const ListProfile: React.FC<ListProfileProps> = () => {
    return (
        <NavBar>
            <ListContents></ListContents>
        </NavBar>
    );

}
export default ListProfile;