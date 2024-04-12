type HeaderProps = {
    usersOnline: number;
}

export default function Header({ usersOnline }: HeaderProps) {
    return (
        <div className="header-container">
            <h1>Audience Questions</h1>
            {usersOnline === 0 ? (
                <></>
            ) : (
                <span className="users-online">Users online: {usersOnline}</span>
            )}
        </div>
    );
}