// app/page.tsx
'use client';

import Image from "next/image";
import styles from "./page.module.css";
import Logo from "./assets/logo.svg";
import { useState } from "react";
import ClientButtons from "./ClientButtons";

const radioOptions = [
  { id: "1", label: "감성적", example: "요즘 나 진짜 힘들었어…" },
  { id: "2", label: "현실적", example: "와이파이 고장났어 미안……" },
  { id: "3", label: "창의적", example: "고양이가 노트북을 물어뜯었어……" },
  { id: "4", label: "허세형", example: "갑자기 서울대 면접이…" },
];

export default function Home() {
  const [excuseText, setExcuseText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExcuseGenerate = async (formData: FormData) => {
    const selectedStyleValue = formData.get("radio");
    const excuseTextValue = formData.get("excuseText");

    if (!selectedStyleValue || !excuseTextValue) {
      alert("입력값이 누락되었습니다.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("선택된 스타일:", selectedStyleValue);
      console.log("입력된 변명 내용:", excuseTextValue);

      const response = await fetch('/api/generate-excuse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style: selectedStyleValue,
          text: excuseTextValue
        })
      });

      if (!response.ok) {
        throw new Error('변명 생성에 실패했습니다.');
      }

      const result = await response.json();
      
      setExcuseText(result.generatedExcuse);
      
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleExcuseGenerate} className={styles.container} onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleExcuseGenerate(formData);
    }}>
      <span>당신만의 참신한 별명을 떠올려보세요!</span>

      <div className={styles.logoAndTitle}>
        <Image src={Logo} alt="로고" />
        <span className={styles.title}>변명 생성기</span>
      </div>

      <textarea
        name="excuseText"
        value={excuseText}
        onChange={(e) => setExcuseText(e.target.value)}
        placeholder="변명을 입력해주세요"
        className={styles.excuseTextField}
        disabled={isLoading}
      />

      <span className={styles.excuseChooseTitle}>변명 스타일을 선택</span>

      {radioOptions.map(({ id, label, example }) => (
        <label
          key={id}
          htmlFor={`check-${id}`}
          className={styles.sectionContainer}
        >
          <div className={styles.sectionColumn}>
            <span>{label}</span>
            <span>예) {example}</span>
          </div>
          <input
            id={`check-${id}`}
            type="radio"
            name="radio"
            value={id}
            checked={selectedStyle === id}
            onChange={(e) => setSelectedStyle(e.target.value)}
            disabled={isLoading}
          />
        </label>
      ))}

      <div className={styles.bottomButtonContainer}>
        <button type="submit" className={styles.blueButton} disabled={isLoading}>
          {isLoading ? '생성 중...' : '변명 생성하기'}
        </button>
        <ClientButtons/>
      </div>
    </form>
  );
}