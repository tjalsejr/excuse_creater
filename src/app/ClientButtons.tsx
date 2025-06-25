"use client";
import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Share from "./assets/share.png";

export default function ClientButtons() {
// textarea에서 복사할 텍스트 가져오기
  const getTextToCopy = () => {
    const textarea = document.querySelector(
      "textarea[name='excuseText']"
    ) as HTMLTextAreaElement | null;
    return textarea?.value || "";
  };
// 텍스트 복사 기능
  const handleCopy = () => {
    const text = getTextToCopy();
    if (!text) {
      alert("복사할 텍스트가 없습니다.");
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      alert("텍스트가 복사되었습니다.");
    });
  };

  const handleShare = () => {
    if (!navigator.share) {
      alert("공유 기능을 지원하지 않는 환경입니다.");
      return;
    }
    const text = getTextToCopy();
    navigator
      .share({
        title: "변명 생성기",
        text,
        url: window.location.href,
      })
      .catch((error) => {
        console.error("공유 실패:", error);
      });
  };

  return (
    <>
      <button type="button" className={styles.copyButton} onClick={handleCopy}>
        복사
      </button>
      <Image src={Share} alt="공유" onClick={handleShare}/>
    </>
  );
}
