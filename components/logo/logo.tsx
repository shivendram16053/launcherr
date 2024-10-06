import React from 'react'

const Logo = ({ className }: { className?: string }) => {
    return (
        <svg width="72" height="64" viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M0 0H72V36H64C64 20.536 51.464 8 36 8C20.536 8 8 20.536 8 36H0V0ZM8 36H64C64 51.464 51.464 64 36 64C20.536 64 8 51.464 8 36Z" fill="white" />
        </svg>
    )
}

export default Logo