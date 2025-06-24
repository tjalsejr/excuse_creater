"use client";
import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function FormWrapper({ children, onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const excuseText = formData.get("excuseText");
    const selectedStyle = formData.get("radio");

    if (!excuseText || !selectedStyle) {
      alert("입력값이 누락되었습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      alert("서버 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
