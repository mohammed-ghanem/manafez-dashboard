// import Categories from "@/components/categories/Categories";
// import HomeCarousel from "@/components/homeCarousel/HomeCarousel";
// import CircelSlider from "@/components/test/Test";
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react";
export default function Home() {
  return (
    <>
   <Button variant="outline">Button</Button>
   <Mail className="w-5 h-5 text-green-600" />
   <Mail className="w-5 h-5" style={{ color: '#16a34a' }} /> 
  <Phone className="w-5 h-5 text-purple-600" />
  

      {/* <HomeCarousel />
      <CircelSlider />
      <Categories /> */}
    </>
  );
}

