import './SubCategoryCard.scss';

/**
 * SubCategoryCard Molecule Component
 * Displays a category card with name on left and circular image on right
 */
const SubCategoryCard = ({ subCategory, categoryColor, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(subCategory);
        }
    };

    return (
        <div className="sub-category-card" onClick={handleClick} style={{ backgroundColor: categoryColor || '#f8f9fa' }}>
            <div className="sub-category-card__content">
                <h5 className="sub-category-card__title">{subCategory.name}</h5>

                <div className="sub-category-card__image-section">
                    <div className="sub-category-card__container">
                        {subCategory.image ? (
                            <div className="sub-category-card__image-container">
                            <img
                                src={`/images/${subCategory.image}`}
                                alt={subCategory.name}
                                className="sub-category-card__image"
                            />
                            </div>
                        ) : (
                            <div className="sub-category-card__placeholder">
                                <i className="bi bi-image"></i>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SubCategoryCard;
