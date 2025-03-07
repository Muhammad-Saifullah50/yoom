
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <section className="w-full min-h-screen flex items-center justify-center bg-pri">
            {children}
        </section>
    )
}

export default AuthLayout
