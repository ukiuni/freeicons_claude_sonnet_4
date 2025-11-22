import React from 'react';
import { Link } from 'react-router-dom';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page" data-testid="terms-page">
      <div className="terms-container">
        <Link to="/" className="back-link" data-testid="back-link">
          ← ホームに戻る
        </Link>
        
        <h1>利用規約</h1>
        
        <section className="terms-section">
          <h2>1. 利用について</h2>
          <p>
            本サイトで提供されるすべてのSVGアイコンは、<strong>無償</strong>でご利用いただけます。
            商用・非商用を問わず、自由にご利用ください。
          </p>
        </section>

        <section className="terms-section">
          <h2>2. ライセンス</h2>
          <p>
            本サイトのアイコンは自由に使用できます。以下の用途でご利用いただけます：
          </p>
          <ul>
            <li>個人プロジェクト</li>
            <li>商用プロジェクト</li>
            <li>Webサイト・アプリケーション</li>
            <li>印刷物・デジタルメディア</li>
            <li>修正・加工・派生物の作成</li>
          </ul>
          <p>
            クレジット表記は不要ですが、していただけると嬉しいです。
          </p>
        </section>

        <section className="terms-section">
          <h2>3. 禁止事項</h2>
          <p>
            以下の行為は禁止されています：
          </p>
          <ul>
            <li>アイコンそのものを再配布・販売すること</li>
            <li>商標登録や著作権の主張</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. 免責事項</h2>
          <p>
            本サイトで提供されるアイコンおよびサービスは、<strong>いかなる場合でも無保証</strong>です。
          </p>
          <ul>
            <li>本サイトのアイコンの利用により生じた損害について、一切の責任を負いません</li>
            <li>アイコンの品質、正確性、適合性について保証しません</li>
            <li>サービスの中断、エラー、データの損失について責任を負いません</li>
            <li>アイコンが第三者の権利を侵害していないことを保証しません</li>
          </ul>
          <p>
            <strong>
              利用者は自己の責任においてアイコンを使用するものとし、
              本サイトおよび運営者は、いかなる場合においても一切の責任を負いません。
            </strong>
          </p>
        </section>

        <section className="terms-section">
          <h2>5. 規約の変更</h2>
          <p>
            本利用規約は予告なく変更される場合があります。
            変更後の規約は、本ページに掲載された時点で効力を生じます。
          </p>
        </section>

        <section className="terms-section">
          <p className="terms-footer">
            最終更新日: 2025年11月22日
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
