export default function Welcome({ person }) {
    const formatDate = () => {
        const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
        const today = new Date();
        return new Intl.DateTimeFormat('en-US', options).format(today);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold leading-8 text-primary capitalize">Welcome, {person}</h1>
            <span className="text-sm">
                {
                    formatDate()
                }
            </span>
        </div>
    )
}