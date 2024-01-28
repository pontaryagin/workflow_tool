export function DropdownMenuCheckboxes() {
  // const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  // const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  // const [showPanel, setShowPanel] = React.useState<Checked>(false)
   
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel onClick={tmpAction}>Logout</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  
  )
}