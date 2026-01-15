import React from "react";
import FAQCard from "./FAQCard";
import VoiceMemoButton from "./VoiceMemoButton";
import {
  faqData,
  getSectionItems,
  getSubsectionItems,
  findFAQItem,
} from "../data/faqData";

function FAQContentView({
  viewType,
  sectionId,
  subsectionId,
  itemId,
  onItemClick,
  onCardClick,
}) {
  let items = [];
  let title = "";

  if (viewType === "section" && sectionId) {
    items = getSectionItems(sectionId);
    const section = faqData.find((s) => s.id === sectionId);
    title = section?.title || "FAQ Items";
  } else if (viewType === "subsection" && sectionId && subsectionId) {
    items = getSubsectionItems(sectionId, subsectionId);
    const subsection = findFAQItem(subsectionId);
    title = subsection?.subsectionTitle || subsection?.title || "FAQ Items";

    // If subsection has no items, show it as a detail view with voice memo
    if (
      items.length === 0 ||
      (items.length === 1 && items[0].id === subsectionId)
    ) {
      return (
        <div className="faq-detail-view">
          <div className="faq-detail-header relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {title}
                </h1>
                <p className="text-gray-600">
                  {subsection?.sectionTitle}
                  {subsection?.subsectionTitle &&
                    ` / ${subsection.subsectionTitle}`}
                </p>
              </div>
              <div className="ml-4">
                <VoiceMemoButton itemId={subsectionId} />
              </div>
            </div>
          </div>
          <div className="faq-detail-content mt-6">
            <p className="text-gray-700">
              FAQ content for <strong>{title}</strong> will be displayed here.
            </p>
          </div>
        </div>
      );
    }
  } else if (viewType === "item" && itemId) {
    const item = findFAQItem(itemId);
    if (item) {
      return (
        <div className="faq-detail-view">
          <div className="faq-detail-header relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h1>
                <p className="text-gray-600">
                  {item.sectionTitle}
                  {item.subsectionTitle && ` / ${item.subsectionTitle}`}
                </p>
              </div>
              <div className="ml-4">
                <VoiceMemoButton itemId={itemId} />
              </div>
            </div>
          </div>
          <div className="faq-detail-content mt-6">
            {/* Content for individual FAQ item will go here */}
            <p className="text-gray-700">
              FAQ content for <strong>{item.title}</strong> will be displayed
              here.
            </p>
          </div>
        </div>
      );
    }
    return <div>FAQ item not found</div>;
  } else {
    // Default view - show all sections
    return (
      <div className="faq-default-view">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 mb-8">
          Select a section from the sidebar to view available FAQ options.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="faq-empty-view">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600">
          No FAQ items available for this section.
        </p>
      </div>
    );
  }

  return (
    <div className="faq-cards-view">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <FAQCard
            key={item.id}
            item={item}
            onClick={onCardClick || onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

export default FAQContentView;
