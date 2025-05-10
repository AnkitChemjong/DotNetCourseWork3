import React from 'react'
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

function ConfirmDialog({toggleDialog,setToggleDialog,func,title}) {
    const handleCallFunc=async()=>{
        await func();
    }
  return (
    <Dialog open={toggleDialog} onOpenChange={setToggleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Button className="text-black" onClick={handleCallFunc}>Confirm</Button>
        <Button className="text-black" onClick={()=>setToggleDialog(false)}>Cancel</Button>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog
