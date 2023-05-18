const Notification = ({ notification, className }) => {
  if (!notification) return null

  return (
    <div className={className}>
      {notification}
    </div>
  )
}

export default Notification