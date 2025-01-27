"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const Form = () => {
  const formDetails = {
    recipientName: "",
    emailPurpose: "",
    keyPoints: "",
  };

  const [formData, setFormData] = useState(formDetails);
  const [currentSuggestions, setCurrentSuggestions] = useState("");

  const handlePurposeChange = (e) => {
    setFormData({ ...formData, emailPurpose: e });
    const suggestion = emailPurposeOptions.find(
      (option) => option.value === e
    ).suggestions;
    setCurrentSuggestions(suggestion);
  };

  const handleChange = (e) => {
    if (e.target.name === "keyPoints" && e.target.value.length > 300) {
      toast.error("Length exceeded");
      return;
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const generateEmail = async()=>{
    try {
        const response = await axios.post(`http://localhost:3000/api/generateEmail`,formData)
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
  }

  const emailPurposeOptions = [
    {
      value: "meeting",
      label: "Meeting Request",
      suggestions:
        "Include things like proposed time, meeting duration and agenda.",
    },
    {
      value: "follow_up",
      label: "Follow Up",
      suggestions:
        "Include follow up details like previous meeting conversations and conclusions.",
    },
    {
      value: "thank_you",
      label: "Thank You",
      suggestions: "Include specific thing to thank for, next steps if any.",
    },
    {
      value: "other",
      label: "Other",
      suggestions:
        "Include any specific key points you would like to include in your email. ",
    },
  ];

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full h-screen">
      <div className="w-[38%]">
        <h1 className="text-4xl font-semibold tracking-tighter">
          We'd love to help
        </h1>
        <h1 className="text-gray-600">
          Reach out and we'll get in touch within 24 hours.
        </h1>
      </div>

      <div className="w-[38%] flex flex-col gap-4">
        <div>
          <Label htmlFor="recipient">Recipient's Name : </Label>
          <Input
            onChange={(e) => handleChange(e)}
            type="text"
            id="recipient"
            name="recipientName"
            value={formData.recipientName}
            className="bg-white rounded-lg border mt-1 border-gray-300 h-10"
            placeholder="Name of the Recipient"
          />
        </div>
        <div>
          <Label>Email Purpose </Label>
          <Select
            name="emailPurpose"
            value={formData.emailPurpose}
            onValueChange={(e) => handlePurposeChange(e)}
          >
            <SelectTrigger className="bg-white rounded-lg border mt-1 border-gray-300 h-10">
              <SelectValue placeholder="Select purpose for the email" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="bg-white">
                {emailPurposeOptions.map((item) => {
                  return (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Key Points ({formData.keyPoints.length} / 300) </Label>
          <Textarea
            name="keyPoints"
            onChange={(e) => handleChange(e)}
            className="w-full h-32 bg-white rounded-lg border mt-1 border-gray-300"
            placeholder="Key points to include in your email."
            value={formData.keyPoints}
          />
          <p className="text-sm mt-1 text-muted-foreground">
            {currentSuggestions}
          </p>
        </div>
        <Button onClick={()=>generateEmail()} className="w-full h-10 rounded-lg">Generate Email</Button>
      </div>
    </div>
  );
};

export default Form;
