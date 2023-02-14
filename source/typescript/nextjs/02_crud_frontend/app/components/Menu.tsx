import Link from 'next/link';

const Menu = () => {
    return (
        <nav>
            <ul>
                {{- range $k, $v := .Collections}}
                <li>
                    <Link href="/{{$v.JSON}}">{{$v.NamePlural}}</Link>
                </li>
                {{end}}
            </ul>
        </nav>
    );
};

export default Menu;