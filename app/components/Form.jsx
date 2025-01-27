"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Loader2Icon, Copy, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";


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
  
const emptyFormObj = {
  recipientName: "",
  emailPurpose: "",
  keyPoints: "",
};

const emptyEmailObj = {
  subject: "",
  body: "",
};

const Form = () => {

  const [formData, setFormData] = useState(emptyFormObj);
  const [emailData, setEmailData] = useState(emptyEmailObj);
  const [currentSuggestions, setCurrentSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailSection, setShowEmailSection] = useState(false);

  const handlePurposeChange = (e) => {
    setFormData({ ...formData, emailPurpose: e });
    const suggestion = emailPurposeOptions.find(
      (option) => option.value === e
    ).suggestions;
    setCurrentSuggestions(suggestion);
  };

  const handleChange = (e) => {
    if (e.target.name === "keyPoints" && e.target.value.length > 500) {
      toast.error("Length exceeded");
      return;
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const generateEmail = async () => {
    if (!formData.recipientName) {
      toast.error("Please enter recipient name");
      return;
    }

    if (!formData.emailPurpose) {
      toast.error("Please select email purpose");
      return;
    }

    if (!formData.keyPoints) {
      toast.error("Please enter key points");
      return;
    }

    try {
      setLoading(true);
      setShowEmailSection(true);
      const response = await axios.post(
        `https://email-assistant-beta.vercel.app/api/generateEmail`,
        formData
      );
      setEmailData({
        subject: response.data.subject,
        body: response.data.body,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate email");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex items-start max-h-screen justify-center gap-16 max-w-[85%] mx-auto">
      <div className="flex flex-col gap-8 items-center justify-center min-h-screen py-10 !my-0">
        <div className="w-[100%]">
          <h1 className="text-4xl font-semibold tracking-tight">
            Craft the Perfect Email
          </h1>
          <h1 className="text-gray-600">
            Provide the details, and create a professional email in no time!
          </h1>
        </div>

        <div className="w-[100%] flex flex-col gap-4">
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
            <Label>Key Points ({formData.keyPoints.length} / 500) </Label>
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
          <Button
            disabled={loading}
            onClick={() => generateEmail()}
            className="w-full h-10 rounded-lg"
          >
            {loading ? (
              <p className="flex items-center justify-center gap-2">
                Generating Email... <Loader2Icon className="animate-spin" />{" "}
              </p>
            ) : (
              "Generate Email"
            )}
          </Button>
        </div>
      </div>

      {showEmailSection && loading && (
        <div className="w-1/2 my-16 h-[85vh] shadow-lg rounded-lg flex flex-col items-center justify-center bg-white">
          <p className="flex text-muted-foreground text-2xl items-center justify-center gap-2">
            Generating Email... <Loader2 className="animate-spin" />{" "}
          </p>
        </div>
      )}

      {showEmailSection && !loading && (
        <div className="w-1/2 my-16 max-h-[85vh] overflow-auto bg-white">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Generated Email
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <Label className="text-sm font-medium">Subject</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      navigator.clipboard.writeText(emailData.subject);
                      toast.success("Subject copied to clipboard!");
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-[#f7f7f5] shadow-md p-3 rounded-lg text-gray-700">
                  {emailData.subject}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <Label className="text-sm font-medium">Email Body</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      navigator.clipboard.writeText(emailData.body);
                      toast.success("Email body copied to clipboard!");
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-[#f7f7f5] shadow-md p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
                  {emailData.body}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Form;
