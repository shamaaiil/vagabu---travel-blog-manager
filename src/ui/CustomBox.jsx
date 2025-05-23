const CustomBox = ({children}) => {
    return(
        <>
         <div className="min-h-[350px] bg-white border rounded-xl shadow-lg">
           {children}
         </div>
        </>
    )
}

export default CustomBox