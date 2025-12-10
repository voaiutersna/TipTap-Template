import RichtextEditor from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
export default function Home() {
  return (
    <>
      <div className="max-w-3xl mx-auto py-4">
        <RichtextEditor></RichtextEditor>
      </div>
      
      <Button>Submit</Button>
    </>
  )
}